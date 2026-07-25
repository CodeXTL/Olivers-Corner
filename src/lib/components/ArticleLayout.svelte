<script>
	// Shared chrome for every write-up, in any collection: back-link, title,
	// category chips, table of contents, and the CSS that styles the prose that
	// mdsvex generated from Markdown.
	//
	// Named for what it does rather than for one collection — projects, blog
	// posts, and any future collection all render through this same component.
	import CategoryList from './CategoryList.svelte';
	import TableOfContents from './TableOfContents.svelte';

	/**
	 * @type {{
	 *   meta: import('$lib/content/schema.js').Entry,
	 *   children: import('svelte').Snippet,
	 *   backHref?: string,
	 *   backLabel?: string
	 * }}
	 */
	let { meta, children, backHref = '/projects', backLabel = 'Back to Projects' } = $props();

	// Handed to the TOC so it can read the headings the Markdown rendered.
	let post = $state();
</script>

<div class="article">
	<main>
		<a class="back-link" href={backHref}>&larr; {backLabel}</a>

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
	/* The article stays centred on its own; the TOC hangs off to the right when
	   there is room, and drops out entirely on narrow screens. */
	.article {
		display: grid;
		grid-template-columns: minmax(0, var(--measure-article));
		justify-content: center;
		margin: 0 auto;
		/* Top clears the fixed nav; the back-link is the first element and would
		   otherwise sit behind it. Sides and bottom keep the standard inset. */
		padding: var(--nav-height) var(--space-8) var(--space-8);
	}

	.toc-column {
		display: none;
	}

	@media (min-width: 1200px) {
		.article {
			grid-template-columns: minmax(0, var(--measure-article)) 15rem;
			gap: var(--space-12);
		}

		.toc-column {
			display: block;
		}
	}

	.meta-categories {
		margin-top: calc(var(--space-2) * -1);
		margin-bottom: var(--space-8);
	}

	.back-link {
		color: var(--color-text-subtle);
		text-decoration: none;
		margin-bottom: var(--space-8);
		display: inline-block;
	}

	.back-link:hover {
		color: var(--color-text-strong);
	}

	/* -------------------------------------------------------------------------
	   Prose styling.

	   The Markdown body is slotted in as a snippet, so these rules need :global
	   to reach it — Svelte's scoping can't see markup it didn't compile. This
	   block is why every write-up looks consistent without any per-file CSS.
	   ---------------------------------------------------------------------- */

	.post :global(h2) {
		border-bottom: 2px solid var(--color-border);
		padding-bottom: var(--space-2);
		margin-top: var(--space-10);
		margin-bottom: var(--space-4);
	}

	.post :global(p) {
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-4);
	}

	.post :global(ul),
	.post :global(ol) {
		line-height: var(--leading-relaxed);
		padding-left: var(--space-6);
	}

	.post :global(li) {
		margin-bottom: var(--space-3);
	}

	.post :global(code) {
		background: var(--color-surface-muted);
		padding: 0.15rem 0.35rem;
		border-radius: var(--radius-sm);
		font-size: 0.95em;
	}
</style>
