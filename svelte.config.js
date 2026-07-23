import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Register .md as a component extension so mdsvex-compiled Markdown can be
	// imported and rendered exactly like a .svelte file. This is what makes
	// content-as-Markdown work at all.
	extensions: ['.svelte', '.md'],

	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],

	kit: {
		adapter: adapter(),

		alias: {
			// Lets singleton pages import content without counting `../` hops:
			//   import Goals from '$content/goals.md'
			// Collections don't need this — they're discovered by the glob in
			// $lib/content/index.js — but standalone .md pages do.
			$content: 'src/content'
		}
	}
};

export default config;
