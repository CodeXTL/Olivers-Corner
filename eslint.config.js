import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	[
		includeIgnoreFile(gitignorePath),
		js.configs.recommended,
		svelte.configs.recommended,
		{
			languageOptions: { globals: { ...globals.browser, ...globals.node } }
		},

		{
			files: ['**/*.svelte', '**/*.svelte.js'],
			languageOptions: { parserOptions: { svelteConfig } },
			rules: {
				/**
				 * `no-navigation-without-resolve` wants every internal href wrapped in
				 * resolve() so links keep working if the app is ever served from a
				 * sub-path (e.g. example.com/site/ rather than the root).
				 *
				 * This site is deployed at a domain root with no `base` configured, so
				 * the rule only produces noise — it was previously being silenced with
				 * a per-line disable comment at each of a dozen link sites, which is
				 * worse than turning it off deliberately in one place.
				 *
				 * RE-ENABLE THIS if the site ever moves to a sub-path deployment
				 * (GitHub Pages project sites are the common case). At that point
				 * every internal href needs resolve() from $app/paths — note that
				 * entry URLs are all derived in one spot (`href` in
				 * $lib/content/index.js), so the content side is a single edit.
				 */
				'svelte/no-navigation-without-resolve': 'off'
			}
		}
	],
	prettier,
	svelte.configs.prettier
);
