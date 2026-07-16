// Single source of truth for the projects listing.
// Reads frontmatter from every Markdown file in src/content/projects so that
// adding a project is just dropping in one new .md file. To add a category,
// simply list it in a project's `categories` frontmatter array — the master
// list below is derived automatically, so there is nothing else to register.
const modules = import.meta.glob('/src/content/projects/*.md', { eager: true });

export const projects = Object.entries(modules)
	.map(([path, mod]) => ({
		slug: path.split('/').pop().replace('.md', ''),
		...mod.metadata,
		categories: mod.metadata.categories ?? []
	}))
	// Default order: newest first by creation date. `created` / `updated` are
	// ISO datetimes, so sorting/filtering by either is trivial to add later.
	.sort((a, b) => new Date(b.created) - new Date(a.created));

// Deduplicated, alphabetically-sorted master list of every category in use,
// with a count of how many projects carry each. This is the foundation a
// future search/filter UI can read from to build its list of filter options.
export const categories = [...new Set(projects.flatMap((p) => p.categories))]
	.sort((a, b) => a.localeCompare(b))
	.map((name) => ({
		name,
		count: projects.filter((p) => p.categories.includes(name)).length
	}));
