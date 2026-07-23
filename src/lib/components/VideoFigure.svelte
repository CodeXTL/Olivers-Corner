<script>
	// A captioned, auto-playing looped video. `n` renders the "Video N." label.
	let { src, n, caption = '' } = $props();
</script>

<figure class="figure">
	<video autoplay loop muted playsinline>
		<source {src} type="video/mp4" />
		Your browser does not support the video tag.
	</video>
	{#if caption}
		<figcaption>
			{#if n != null}<strong>Video {n}.</strong>{/if}
			{caption}
		</figcaption>
	{/if}
</figure>

<style>
	.figure {
		margin: var(--space-6) 0;
	}

	.figure video {
		width: 100%;
		border-radius: var(--radius-lg);
		display: block;
	}

	figcaption {
		margin-top: var(--space-2);
		line-height: var(--leading-normal);
		color: var(--color-text);
	}
</style>
