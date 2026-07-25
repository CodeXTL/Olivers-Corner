/**
 * The collection registry — the one place a content type is declared.
 *
 * A "collection" is a folder of Markdown under `src/content/` that gets its own
 * listing page and per-entry pages. Everything that differs between collections
 * lives here as data; the engine and the route components read it. Nothing about
 * projects or the blog is hardcoded anywhere else.
 *
 * ## Adding a collection (e.g. notes)
 *
 * 1. Create the folder: `src/content/notes/`.
 * 2. Add an entry to the object below, keyed by folder name.
 * 3. Create two tiny route files that pass the key through:
 *      routes/notes/+page.svelte        → <CollectionPage collection="notes" />
 *      routes/notes/[slug]/+page.js     → export const { load, entries } = entryRoute('notes')
 *      routes/notes/[slug]/+page.svelte → <EntryPage {data} collection="notes" />
 *
 * That's the whole cost. The listing, sorting, categories, prerendering, SEO
 * tags, and nav link all follow from this registry.
 *
 * @see docs/ARCHITECTURE.md §3
 *
 * Both current collections — `projects` and `blog` — are just entries below.
 */

/**
 * How a collection's listing page renders its entries.
 * - `list` — a vertical stack of wide cards with category chips (projects).
 * - `grid` — a fixed-height card grid, better for many short entries (blog).
 *
 * @typedef {'list' | 'grid'} ListingLayout
 */

/**
 * @typedef {object} CollectionConfig
 * @property {string}        name        Folder under `src/content/`. Also the registry key.
 * @property {string}        path        URL base, e.g. `/projects`.
 * @property {string}        navLabel    Short label for the nav bar.
 * @property {string}        heading     `<h1>` on the listing page.
 * @property {string}        description Meta description for the listing page.
 * @property {ListingLayout} layout      Which card style the listing uses.
 * @property {string}        [intro]     Optional paragraph under the listing heading.
 * @property {string}        [empty]     Shown when the collection has no entries yet.
 */

/** @type {Record<string, CollectionConfig>} */
export const collections = {
	projects: {
		name: 'projects',
		path: '/projects',
		navLabel: 'Projects',
		heading: 'Technical Projects',
		description: 'Full technical project write-ups by Oliver Lee.',
		layout: 'list',
		empty: 'No projects published yet.'
	},

	blog: {
		name: 'blog',
		path: '/blog',
		navLabel: 'Blog',
		heading: 'Blog',
		description: 'Deep dives, project breakdowns, and things worth explaining, by Oliver Lee.',
		layout: 'grid',
		intro:
			'Deep dives, breakdowns of parts of a project, and the occasional thing I just think is cool and want to explain.',
		empty: 'No posts yet, check back soon.'
	}
};

/**
 * Looks up a collection's config, failing loudly on a typo'd key.
 *
 * Route components pass a string (`collection="projects"`), so this is the
 * boundary where that string gets validated. A clear throw here beats a page
 * that renders blank.
 *
 * @param {string} name
 * @returns {CollectionConfig}
 */
export function getCollectionConfig(name) {
	const config = collections[name];
	if (!config) {
		const known = Object.keys(collections).join(', ');
		throw new Error(`Unknown collection "${name}". Registered collections: ${known}.`);
	}
	return config;
}

/** The "Back to X" label for an entry page. Derived, so it can't drift. */
export const backLabelFor = (/** @type {CollectionConfig} */ config) =>
	`Back to ${config.navLabel}`;
