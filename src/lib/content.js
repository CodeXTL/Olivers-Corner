// Shared frontmatter plumbing for Markdown-backed collections (projects, minis).
//
// Vite requires `import.meta.glob` to take a literal pattern, so each collection
// keeps its own one-line glob and hands the result here.

// Turns a map of imported .md modules into sorted, plain metadata objects.
export function collect(modules) {
	return (
		Object.entries(modules)
			.map(([path, mod]) => ({
				slug: path.split('/').pop().replace('.md', ''),
				...mod.metadata,
				categories: mod.metadata.categories ?? []
			}))
			// Default order: newest first by creation date. `created` / `updated` are
			// ISO datetimes, so sorting/filtering by either is trivial to add later.
			.sort((a, b) => new Date(b.created) - new Date(a.created))
	);
}

// Deduplicated, alphabetically-sorted master list of every category in use,
// with a count of how many entries carry each. This is the foundation a
// future search/filter UI can read from to build its list of filter options.
export function deriveCategories(items) {
	return [...new Set(items.flatMap((item) => item.categories))]
		.sort((a, b) => a.localeCompare(b))
		.map((name) => ({
			name,
			count: items.filter((item) => item.categories.includes(name)).length
		}));
}
