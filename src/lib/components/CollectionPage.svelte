<script>
	// The listing page for any collection.
	//
	// `/projects` and `/blog` were near-identical files that differed only in
	// which array they imported and whether cards stacked or gridded. Both are
	// now one-liners that name their collection; this component reads the rest
	// from the registry, so a third collection costs no new listing code.
	import { getEntries } from '$lib/content/index.js';
	import { getCollectionConfig } from '$lib/content/collections.js';
	import EntryListCard from './EntryListCard.svelte';
	import EntryGridCard from './EntryGridCard.svelte';
	import Seo from './Seo.svelte';

	/** @type {{ collection: string }} */
	let { collection } = $props();

	let config = $derived(getCollectionConfig(collection));
	let entries = $derived(getEntries(collection));
</script>

<Seo title={config.heading} description={config.description} />

<main class="page-wide">
	<h1>{config.heading}</h1>

	{#if config.intro}
		<p class="intro">{config.intro}</p>
	{/if}

	{#if entries.length === 0}
		<p>{config.empty}</p>
	{:else if config.layout === 'grid'}
		<div class="entry-grid">
			{#each entries as entry (entry.slug)}
				<EntryGridCard {entry} />
			{/each}
		</div>
	{:else}
		{#each entries as entry (entry.slug)}
			<EntryListCard {entry} />
		{/each}
	{/if}
</main>

<style>
	.intro {
		max-width: var(--measure-prose);
		margin-bottom: var(--space-10);
	}

	.entry-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-8);
	}

	/* Three columns is the target; step down rather than squash the cards. */
	@media (max-width: 1000px) {
		.entry-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.entry-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
