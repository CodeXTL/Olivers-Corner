<script>
	// Renders a project's categories as chips. Kept as its own component so the
	// chips look identical on cards and detail pages, and so they can be turned
	// into filter links (e.g. /projects?category=...) once search/filter lands.
	let { categories = [] } = $props();
</script>

{#if categories.length}
	<ul class="categories">
		{#each categories as category}
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
		gap: 0.5rem;
	}

	.category {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1;
		color: #444;
		background-color: #f0f0f0;
		border: 1px solid #e2e2e2;
		border-radius: 999px;
		padding: 0.35rem 0.7rem;
		white-space: nowrap;
	}
</style>
