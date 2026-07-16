import { error } from '@sveltejs/kit';

// Tell the prerenderer which project pages exist.
export function entries() {
	const modules = import.meta.glob('/src/content/projects/*.md');
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop().replace('.md', '')
	}));
}

export async function load({ params }) {
	try {
		const project = await import(`../../../content/projects/${params.slug}.md`);
		return {
			content: project.default,
			meta: project.metadata
		};
	} catch {
		throw error(404, `Could not find project: ${params.slug}`);
	}
}
