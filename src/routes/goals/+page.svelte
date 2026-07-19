<script>
	// Prose lives in src/content/goals.md so it can be edited without touching
	// markup. Styling needs no work here: the global element rules in app.css
	// cover the Markdown output exactly as they covered hand-written HTML.
	//
	// This is the "singleton page" pattern — a standalone .md file rather than a
	// collection. See docs/CONTENT.md §3.
	import Goals, { metadata } from '$content/goals.md';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title={metadata.title}
	description="Oliver Lee's career goals — semiconductors, chiplets, heterogeneous packaging, and device fabrication."
/>

<div class="page">
	<main>
		<h1>{metadata.title}</h1>

		<Goals />
	</main>
</div>
