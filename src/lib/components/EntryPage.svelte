<script>
	// The write-up page for a single entry in any collection.
	//
	// Pairs with `entryRoute()` in the content engine: that supplies `data`,
	// this renders it. Both collection `[slug]` routes reduce to one line each.
	import ArticleLayout from './ArticleLayout.svelte';
	import Seo from './Seo.svelte';
	import { getCollectionConfig, backLabelFor } from '$lib/content/collections.js';

	/**
	 * @type {{
	 *   data: { content: import('svelte').Component, meta: import('$lib/content/schema.js').Entry },
	 *   collection: string
	 * }}
	 */
	let { data, collection } = $props();

	let config = $derived(getCollectionConfig(collection));
	let Content = $derived(data.content);
</script>

<Seo
	title={data.meta.title}
	description={data.meta.overview}
	image={data.meta.thumbnail}
	type="article"
/>

<ArticleLayout meta={data.meta} backHref={config.path} backLabel={backLabelFor(config)}>
	<Content />
</ArticleLayout>
