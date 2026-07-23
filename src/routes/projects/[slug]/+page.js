// `entryRoute` supplies both `load` (fetch this slug's Markdown) and `entries`
// (tell the prerenderer which slugs exist). See $lib/content/index.js.
import { entryRoute } from '$lib/content/index.js';

export const { load, entries } = entryRoute('projects');
