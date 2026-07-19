// Single source of truth for the projects listing.
// Reads frontmatter from every Markdown file in src/content/projects so that
// adding a project is just dropping in one new .md file. To add a category,
// simply list it in a project's `categories` frontmatter array — the master
// list below is derived automatically, so there is nothing else to register.
import { collect, deriveCategories } from './content.js';

const modules = import.meta.glob('/src/content/projects/*.md', { eager: true });

export const projects = collect(modules);
export const categories = deriveCategories(projects);
