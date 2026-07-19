import { error } from '@sveltejs/kit';

// Tell the prerenderer which mini pages exist.
export function entries() {
	const modules = import.meta.glob('/src/content/minis/*.md');
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop().replace('.md', '')
	}));
}

export async function load({ params }) {
	try {
		const mini = await import(`../../../content/minis/${params.slug}.md`);
		return {
			content: mini.default,
			meta: mini.metadata
		};
	} catch {
		throw error(404, `Could not find mini project: ${params.slug}`);
	}
}
