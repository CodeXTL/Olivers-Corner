<script>
	// A captioned image. `n` renders the "Figure N." label; `caption` is the rest.
	let { src, alt = '', n, caption = '' } = $props();
</script>

<figure class="figure">
	<img {src} {alt} />
	{#if caption}
		<figcaption>
			{#if n != null}<strong>Figure {n}.</strong>{/if}
			{caption}
		</figcaption>
	{/if}
</figure>

<style>
	.figure {
		margin: var(--space-6) 0;
	}

	.figure img {
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
