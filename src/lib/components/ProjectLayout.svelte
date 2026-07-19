<script>
	// Shared chrome for every project write-up. Renders the back-link and title,
	// and styles the Markdown-generated prose (headings, paragraphs, lists, code).
	import CategoryList from './CategoryList.svelte';
	import TableOfContents from './TableOfContents.svelte';

	let { meta, children } = $props();

	// Handed to the TOC so it can read the headings the Markdown rendered.
	let post = $state();
</script>

<div class="project-article">
	<main>
		<a class="back-link" href="/projects">&larr; Back to Projects</a>

		<h1>{meta.title}</h1>

		<div class="meta-categories">
			<CategoryList categories={meta.categories} />
		</div>

		<div class="post" bind:this={post}>
			{@render children()}
		</div>
	</main>

	<aside class="toc-column">
		<TableOfContents container={post} />
	</aside>
</div>

<style>
	/* Article stays centred on its own; the TOC hangs off to the right when there
	   is room for it, and drops out entirely on narrow screens. */
	.project-article {
		display: grid;
		grid-template-columns: minmax(0, 900px);
		justify-content: center;
		margin: 0 auto;
		padding: 2rem;
	}

	.toc-column {
		display: none;
	}

	@media (min-width: 1200px) {
		.project-article {
			grid-template-columns: minmax(0, 900px) 15rem;
			gap: 3rem;
		}

		.toc-column {
			display: block;
		}
	}

	.meta-categories {
		margin-top: -0.5rem;
		margin-bottom: 2rem;
	}

	.back-link {
		color: #888;
		text-decoration: none;
		margin-bottom: 2rem;
		display: inline-block;
	}

	.back-link:hover {
		color: #000;
	}

	/* Markdown output is slotted in, so it needs :global to be styled from here. */
	.post :global(h2) {
		border-bottom: 2px solid #eaeaea;
		padding-bottom: 0.5rem;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	.post :global(p) {
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.post :global(ul),
	.post :global(ol) {
		line-height: 1.6;
		padding-left: 1.5rem;
	}

	.post :global(li) {
		margin-bottom: 0.75rem;
	}

	.post :global(code) {
		background: #f0f0f0;
		padding: 0.15rem 0.35rem;
		border-radius: 4px;
		font-size: 0.95em;
	}
</style>
