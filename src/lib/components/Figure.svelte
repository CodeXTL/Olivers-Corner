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
		margin: 1.5rem 0;
	}

	.figure img {
		width: 100%;
		border-radius: 10px;
		display: block;
	}

	figcaption {
		margin-top: 0.5rem;
		line-height: 1.5;
		color: #333;
	}
</style>
