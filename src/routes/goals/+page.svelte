<script>
	// Prose lives in src/content/goals.md so it can be edited without touching
	// markup. Styling is unchanged: the global app.css rules for h1/p/ul/li
	// cover the Markdown output exactly as they covered the hand-written HTML.
	import Goals, { metadata } from '../../content/goals.md';
</script>

<svelte:head>
	<title>{metadata.title} | Oliver's Corner</title>
</svelte:head>

<div class="page-wrapper">
	<main>
		<h1>{metadata.title}</h1>

		<Goals />
	</main>
</div>
