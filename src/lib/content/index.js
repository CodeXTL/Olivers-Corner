/**
 * The content engine.
 *
 * Reads every Markdown file under `src/content/<collection>/` and turns it into
 * sorted, typed entry metadata. This is collection-agnostic: it discovers
 * collections from the folder structure, so adding one never means editing this
 * file.
 *
 * ## Why two globs
 *
 * Vite requires `import.meta.glob` to take a *literal* pattern — it is resolved
 * at build time, not at runtime. That's why there is one pattern here covering
 * all collections rather than one glob per collection.
 *
 * The pair is deliberate:
 *
 * - `metaModules` is eager but uses `import: 'metadata'`, so the bundler pulls
 *   in **only the frontmatter object** from each file. The compiled write-up
 *   body is tree-shaken away. Listing pages therefore ship kilobytes of
 *   metadata rather than every article on the site.
 * - `componentLoaders` is lazy (no `eager`), so each write-up becomes its own
 *   chunk that loads when someone actually visits that page.
 *
 * Getting this wrong is the classic mdsvex performance trap: a single eager
 * glob bundles every article into every page that reads the listing.
 *
 * @see docs/ARCHITECTURE.md §3
 */

import { error } from '@sveltejs/kit';
import { getCollectionConfig } from './collections.js';
import { warnOnInvalidFrontmatter } from './schema.js';

/** @typedef {import('./schema.js').Entry} Entry */
/** @typedef {import('./schema.js').Category} Category */

/** Frontmatter only — body is tree-shaken out. @type {Record<string, any>} */
const metaModules = import.meta.glob('/src/content/*/*.md', {
	eager: true,
	import: 'metadata'
});

/** Lazy component loaders, one chunk per write-up. */
const componentLoaders = import.meta.glob('/src/content/*/*.md');

/**
 * Splits `/src/content/projects/mousecam.md` into its collection and slug.
 *
 * @param {string} path
 * @returns {{ collection: string, slug: string }}
 */
function parsePath(path) {
	// ['', 'src', 'content', '<collection>', '<file>.md']
	const [, , , collection, file] = path.split('/');
	return { collection, slug: file.replace(/\.md$/, '') };
}

/**
 * Every entry on the site, grouped by collection and sorted newest-first.
 *
 * Built once at module load. Because the whole site is prerendered, this runs
 * at build time and the result is baked into the HTML.
 *
 * @type {Map<string, Entry[]>}
 */
const index = new Map();

for (const [path, meta] of Object.entries(metaModules)) {
	const { collection, slug } = parsePath(path);

	warnOnInvalidFrontmatter(meta, path);

	/** @type {Entry} */
	const entry = {
		...meta,
		slug,
		collection,
		// Derived so no template ever hand-builds a URL — that's how dead links
		// creep in when a route moves.
		href: `/${collection}/${slug}`,
		categories: meta.categories ?? []
	};

	const bucket = index.get(collection) ?? [];
	bucket.push(entry);
	index.set(collection, bucket);
}

// Newest first. `created` is an ISO datetime, so alternate orderings (by
// `updated`, ascending, etc.) are a one-line change at the call site.
for (const entries of index.values()) {
	entries.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

/**
 * All entries in a collection, newest first.
 *
 * @param {string} name Collection key, e.g. `'projects'`.
 * @returns {Entry[]}
 */
export function getEntries(name) {
	getCollectionConfig(name); // throws on an unregistered collection
	return index.get(name) ?? [];
}

/**
 * The deduplicated, alphabetically sorted categories used by a collection,
 * each with a count of how many entries carry it.
 *
 * There is no central category list to maintain: categories are derived from
 * whatever the content declares. This is the data a filter UI would render.
 *
 * @param {string} name
 * @returns {Category[]}
 */
export function getCategories(name) {
	const entries = getEntries(name);
	const counts = new Map();

	for (const entry of entries) {
		for (const category of entry.categories) {
			counts.set(category, (counts.get(category) ?? 0) + 1);
		}
	}

	return [...counts]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Metadata for a single entry, or `undefined` if it doesn't exist.
 *
 * @param {string} name
 * @param {string} slug
 * @returns {Entry | undefined}
 */
export function getEntry(name, slug) {
	return getEntries(name).find((entry) => entry.slug === slug);
}

/**
 * Builds the `load` and `entries` exports for a `[slug]/+page.js`.
 *
 * Both collection entry routes are identical apart from which folder they read,
 * so they share this factory rather than duplicating the loader. A route file
 * becomes one line:
 *
 * ```js
 * export const { load, entries } = entryRoute('projects');
 * ```
 *
 * `entries()` tells the prerenderer which URLs exist, so every write-up is
 * rendered to static HTML at build time even if nothing links to it yet.
 *
 * @param {string} name
 */
export function entryRoute(name) {
	const config = getCollectionConfig(name);

	return {
		entries: () => getEntries(name).map(({ slug }) => ({ slug })),

		/** @param {{ params: { slug: string } }} event */
		load: async ({ params }) => {
			const meta = getEntry(name, params.slug);
			const loader = componentLoaders[`/src/content/${name}/${params.slug}.md`];

			// Metadata and loader come from the same glob pattern, so in practice
			// these are missing together — a slug that simply doesn't exist.
			if (!meta || !loader) {
				throw error(404, `No ${config.navLabel} entry found for "${params.slug}".`);
			}

			const module = /** @type {{ default: import('svelte').Component }} */ (await loader());

			return { content: module.default, meta };
		}
	};
}
