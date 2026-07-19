<script>
	// One entry in the /minis grid. Every card is the same fixed height so the
	// grid stays even regardless of how long a title or overview runs.
	let { mini } = $props();
</script>

<a class="mini-card" href="/minis/{mini.slug}">
	<div class="mini-thumbnail">
		{#if mini.thumbnail}
			<img src={mini.thumbnail} alt="{mini.title} thumbnail" />
		{:else}
			<!-- Keeps the 40/60 split intact for minis that have no image yet. -->
			<div class="thumbnail-placeholder" aria-hidden="true"></div>
		{/if}
	</div>

	<div class="mini-info">
		<h2>{mini.title}</h2>
		<p class="completion">{mini.completion}</p>
		<p class="overview">{mini.overview}</p>
	</div>
</a>

<style>
	.mini-card {
		/* Fixed height + column flex is what guarantees identical cards. */
		height: 22rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.mini-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
	}

	.mini-card:focus-visible {
		outline: 2px solid #111;
		outline-offset: 3px;
	}

	/* The top 40% of the card, always — flex-basis with no grow/shrink. */
	.mini-thumbnail {
		flex: 0 0 40%;
		overflow: hidden;
		background-color: #f0f0f0;
	}

	.mini-thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.thumbnail-placeholder {
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e8e8e8 10px, #e8e8e8 20px);
	}

	/* The remaining 60%: title, completion date, overview. */
	.mini-info {
		flex: 1 1 auto;
		min-height: 0; /* lets the overview clamp instead of overflowing */
		display: flex;
		flex-direction: column;
		padding: 1rem 1.25rem 1.25rem;
	}

	.mini-info h2 {
		font-size: 1.05rem;
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
		font-size: 0.85rem;
		color: #888;
		margin: 0.35rem 0 0.6rem;
	}

	.overview {
		font-size: 0.95rem;
		line-height: 1.45;
		color: #333;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (prefers-reduced-motion: reduce) {
		.mini-card {
			transition: none;
		}

		.mini-card:hover {
			transform: none;
		}
	}
</style>
