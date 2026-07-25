<script>
	// A wide, stacked card — the `list` listing layout. Used by /projects, where
	// there are few enough entries that each deserves room for its categories.
	import CategoryList from './CategoryList.svelte';

	/** @type {{ entry: import('$lib/content/schema.js').Entry }} */
	let { entry } = $props();
</script>

<article class="card">
	<a class="thumbnail" href={entry.href} tabindex="-1" aria-hidden="true">
		{#if entry.thumbnail}
			<img src={entry.thumbnail} alt="" />
		{:else}
			<div class="placeholder"></div>
		{/if}
	</a>

	<div class="info">
		<h2><a href={entry.href}>{entry.title}</a></h2>
		<p class="completion">{entry.completion}</p>
		<p>
			<strong>Overview:</strong>
			{entry.overview}
			<a href={entry.href}>Read more!</a>
		</p>
		<CategoryList categories={entry.categories} />
	</div>
</article>

<style>
	.card {
		display: flex;
		gap: var(--space-8);
		background-color: var(--color-surface);
		padding: var(--space-6);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
		margin-bottom: var(--space-10);
		align-items: flex-start;
	}

	.thumbnail {
		flex: 0 0 200px;
	}

	.thumbnail img,
	.placeholder {
		width: 100%;
		height: auto;
		border-radius: var(--radius-md);
		object-fit: cover;
		aspect-ratio: 4 / 3;
		border: 1px solid var(--color-border);
	}

	.placeholder {
		background: repeating-linear-gradient(
			45deg,
			var(--color-surface-muted),
			var(--color-surface-muted) 10px,
			var(--color-placeholder-stripe) 10px,
			var(--color-placeholder-stripe) 20px
		);
	}

	.info {
		flex: 1;
	}

	.info h2 {
		margin-top: 0;
		margin-bottom: var(--space-2);
		border-bottom: none;
		padding-bottom: 0;
	}

	/* Supporting metadata, not body copy — steps down from the global `p` size. */
	.completion {
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
		margin-top: calc(var(--space-1) * -1);
		margin-bottom: var(--space-3);
	}

	/* The title links through, but should read as a heading rather than a link.
	   Hover is the only affordance. */
	h2 a {
		color: inherit;
		text-decoration: none;
	}

	h2 a:hover {
		color: var(--color-text-strong);
		text-decoration: underline;
	}

	@media (max-width: 600px) {
		.card {
			flex-direction: column;
			gap: var(--space-4);
		}

		.thumbnail {
			flex: 1 1 auto;
			width: 100%;
		}
	}
</style>
