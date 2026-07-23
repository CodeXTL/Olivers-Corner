/**
 * Site-wide configuration.
 *
 * Anything that describes the site as a whole — its name, the person behind it,
 * where it's deployed, what's in the nav — lives here rather than being typed
 * into individual components. Renaming the site or adding a nav link is a
 * one-line edit in this file.
 */

import { collections } from './content/collections.js';

export const site = {
	name: "Oliver's Corner",

	/** Appended to every page title, e.g. `Projects | Oliver's Corner`. */
	titleSuffix: "Oliver's Corner",

	/** Fallback meta description for pages that don't supply their own. */
	description:
		"Oliver Lee's corner of the internet — technical write-ups on embedded systems, integrated circuits, optics, and semiconductor devices.",

	/**
	 * Canonical origin, no trailing slash. Used to build absolute URLs for
	 * Open Graph tags, which require them (relative URLs are ignored by
	 * crawlers and link-preview scrapers).
	 *
	 * TODO: replace with the real production domain once it's set. Until then
	 * social previews will point at the wrong host — everything else works.
	 */
	url: 'https://www.oliverscorner.net/',

	author: 'Oliver Lee',
	email: 'xli3086@gatech.edu',
	github: 'https://github.com/CodeXTL',

	/** Social/preview image, served from `static/`. */
	ogImage: '/headshot.jpg'
};

/**
 * Standalone pages, in nav order. Collection links are appended automatically
 * below, so a new content type shows up in the nav without touching this list.
 *
 * @type {{ href: string, label: string }[]}
 */
const staticLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/about', label: 'About Me' },
	{ href: '/resume', label: 'Resume' },
	{ href: '/goals', label: 'Career Goals' }
];

/**
 * The nav bar's links: fixed pages first, then one per registered collection.
 *
 * Deriving the collection half means the nav can never fall out of sync with
 * what actually exists under `src/content/`.
 *
 * @type {{ href: string, label: string }[]}
 */
export const navLinks = [
	...staticLinks,
	...Object.values(collections).map(({ path, navLabel }) => ({
		href: path,
		label: navLabel
	}))
];

/**
 * External links shown in the footer.
 *
 * @type {{ href: string, label: string }[]}
 */
export const socialLinks = [
	{ href: site.github, label: 'GitHub' },
	{ href: `mailto:${site.email}`, label: 'Email' }
];
