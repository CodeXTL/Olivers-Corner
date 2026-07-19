<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<Nav />
<div class="site-body">
	{@render children()}
</div>
<Footer />

<style>
	/* Grows to fill any leftover space so the footer sits at the bottom of the
	   viewport on short pages instead of floating mid-screen. */
	.site-body {
		flex: 1 0 auto;
	}
</style>
