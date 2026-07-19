/**
 * Frontmatter schema for Markdown-backed content.
 *
 * These JSDoc typedefs are what give you editor autocomplete and red squiggles
 * on `entry.titel` — the project is plain JavaScript, so types live here in
 * comments rather than in a `.ts` file. `jsconfig.json` has `checkJs` behaviour
 * through the Svelte language server, so your editor enforces them for free.
 *
 * @see docs/CONTENT.md for the authoring guide these fields feed.
 */

/**
 * The YAML block at the top of every content `.md` file.
 *
 * @typedef {object} Frontmatter
 * @property {string}   title       Card heading, page `<h1>`, and browser tab.
 * @property {string}   overview    One-paragraph summary, shown on the card and
 *                                  used as the page's meta description.
 * @property {string}   completion  Human-readable "finished when", e.g. `'April 2026'`.
 *                                  Free text — display only.
 * @property {string}   created     ISO datetime. **Sorts the listing (newest first).**
 * @property {string}   [updated]   ISO datetime of the last meaningful edit.
 * @property {string[]} [categories] Tags. Drives chips and the category index.
 * @property {string}   [thumbnail] Card image URL, by convention `/{slug}/Thumbnail.jpg`.
 *                                  Optional — cards fall back to a placeholder.
 */

/**
 * A fully resolved entry: frontmatter plus everything the engine derives.
 *
 * @typedef {Frontmatter & {
 *   slug: string,
 *   collection: string,
 *   href: string,
 *   categories: string[]
 * }} Entry
 */

/**
 * A category with a count of how many entries carry it.
 *
 * @typedef {{ name: string, count: number }} Category
 */

/** Fields that must be present for an entry to render correctly. */
const REQUIRED_FIELDS = ['title', 'overview', 'completion', 'created'];

/**
 * Warns (in dev only) about frontmatter that will render wrong.
 *
 * This is deliberately a warning rather than a thrown error: a half-finished
 * draft should still be previewable on the dev server. The build stays green,
 * but the terminal tells you exactly which file and field to fix.
 *
 * @param {Record<string, unknown>} meta Raw frontmatter from mdsvex.
 * @param {string} path Source path, for a useful message.
 */
export function warnOnInvalidFrontmatter(meta, path) {
	if (!import.meta.env.DEV) return;

	const missing = REQUIRED_FIELDS.filter((field) => meta?.[field] == null || meta[field] === '');
	if (missing.length) {
		console.warn(`[content] ${path} is missing frontmatter: ${missing.join(', ')}`);
	}

	// `created` drives sort order, so an unparseable date silently scrambles the
	// listing — worth calling out specifically.
	if (meta?.created && Number.isNaN(new Date(/** @type {string} */ (meta.created)).getTime())) {
		console.warn(`[content] ${path} has an unparseable \`created\` date: ${meta.created}`);
	}

	if (meta?.categories && !Array.isArray(meta.categories)) {
		console.warn(`[content] ${path}: \`categories\` must be a YAML array, e.g. ['Optics'].`);
	}
}
