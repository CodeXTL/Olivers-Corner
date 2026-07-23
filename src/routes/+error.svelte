<script>
	// Rendered whenever a route throws — most often a 404 from a bad slug.
	// Without this, SvelteKit falls back to an unstyled default page that looks
	// nothing like the rest of the site.
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title={`${page.status}`} description="That page could not be found." />

<div class="page">
	<main>
		<h1>{page.status} — {page.error?.message ?? 'Something went wrong'}</h1>

		<p>
			That page doesn't exist, or it moved. Try the
			<a href="/projects">projects</a> or head back
			<a href="/">home</a>.
		</p>
	</main>
</div>
