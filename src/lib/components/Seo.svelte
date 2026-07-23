<script>
	// Every page's <head> metadata in one place.
	//
	// Before this existed, each route hand-wrote `<title>… | Oliver's Corner</title>`
	// and nothing else — so the suffix was duplicated eight times and no page had a
	// description, canonical URL, or link-preview tags. Routes now render
	// `<Seo title="…" description="…" />` and get the whole set consistently.
	import { page } from '$app/state';
	import { site } from '$lib/config.js';

	let {
		/** Page-specific title. Omit on the homepage to show the bare site name. */
		title = '',
		/** Falls back to the site description so no page ships without one. */
		description = site.description,
		/** Preview image path (absolute or root-relative). */
		image = site.ogImage,
		/** `article` for write-ups, `website` for everything else. */
		type = 'website'
	} = $props();

	let fullTitle = $derived(title ? `${title} | ${site.titleSuffix}` : site.titleSuffix);

	// Open Graph requires absolute URLs — crawlers and chat apps ignore relative
	// ones, which is why these are joined against the configured origin.
	let canonical = $derived(new URL(page.url.pathname, site.url).href);
	let absoluteImage = $derived(new URL(image, site.url).href);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={absoluteImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
