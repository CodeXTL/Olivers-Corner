<script>
	// Renders a project's categories as chips. Kept as its own component so the
	// chips look identical on cards and detail pages, and so they can be turned
	// into filter links (e.g. /projects?category=...) once search/filter lands.
	let { categories = [] } = $props();
</script>

{#if categories.length}
	<ul class="categories">
		{#each categories as category (category)}
			<li class="category">{category}</li>
		{/each}
	</ul>
{/if}

<style>
	.categories {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.category {
		margin: 0;
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		line-height: 1;
		color: var(--color-text);
		background-color: var(--color-surface-muted);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-pill);
		padding: 0.35rem 0.7rem;
		white-space: nowrap;
	}
</style>
