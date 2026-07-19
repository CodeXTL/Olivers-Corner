<script>
	// A fixed-height grid card — the `grid` listing layout. Used by /minis, where
	// many short entries need to stay scannable.
	//
	// Every card is the same height so the grid stays even regardless of how long
	// a title or overview runs; the text clamps rather than pushing the card.
	/** @type {{ entry: import('$lib/content/schema.js').Entry }} */
	let { entry } = $props();
</script>

<a class="card" href={entry.href}>
	<div class="thumbnail">
		{#if entry.thumbnail}
			<img src={entry.thumbnail} alt="" />
		{:else}
			<!-- Keeps the 40/60 split intact for entries with no image yet. -->
			<div class="placeholder" aria-hidden="true"></div>
		{/if}
	</div>

	<div class="info">
		<h2>{entry.title}</h2>
		<p class="completion">{entry.completion}</p>
		<p class="overview">{entry.overview}</p>
	</div>
</a>

<style>
	.card {
		/* Fixed height + column flex is what guarantees identical cards. */
		height: 22rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background-color: var(--color-surface);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
		text-decoration: none;
		color: inherit;
		transition:
			transform var(--duration-fast) var(--ease),
			box-shadow var(--duration-fast) var(--ease);
	}

	.card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-md);
	}

	/* The top 40% of the card, always — flex-basis with no grow/shrink. */
	.thumbnail {
		flex: 0 0 40%;
		overflow: hidden;
		background-color: var(--color-surface-muted);
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.placeholder {
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			45deg,
			var(--color-surface-muted),
			var(--color-surface-muted) 10px,
			#e8e8e8 10px,
			#e8e8e8 20px
		);
	}

	/* The remaining 60%: title, completion date, overview. */
	.info {
		flex: 1 1 auto;
		min-height: 0; /* lets the overview clamp instead of overflowing */
		display: flex;
		flex-direction: column;
		padding: var(--space-4) var(--space-5) var(--space-5);
	}

	.info h2 {
		font-size: var(--text-md);
		margin: 0;
		border-bottom: none;
		padding-bottom: 0;
		/* Two lines max, so a long title can't push the overview out. */
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.completion {
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
		margin: var(--space-1) 0 var(--space-2);
	}

	.overview {
		font-size: var(--text-base);
		line-height: var(--leading-snug);
		color: var(--color-text);
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Motion tokens go to 0s under prefers-reduced-motion, but transform needs
	   an explicit opt-out since it isn't a transition. */
	@media (prefers-reduced-motion: reduce) {
		.card:hover {
			transform: none;
		}
	}
</style>
