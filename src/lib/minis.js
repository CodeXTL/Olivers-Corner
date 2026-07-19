// Single source of truth for the minis listing — smaller write-ups that follow
// exactly the same content pipeline as projects. Adding a mini is just dropping
// a new .md file into src/content/minis.
import { collect, deriveCategories } from './content.js';

const modules = import.meta.glob('/src/content/minis/*.md', { eager: true });

export const minis = collect(modules);
export const miniCategories = deriveCategories(minis);
