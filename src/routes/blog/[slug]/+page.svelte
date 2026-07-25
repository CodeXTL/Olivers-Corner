<script>
	import EntryPage from '$lib/components/EntryPage.svelte';

	let { data } = $props();
</script>

<EntryPage {data} collection="blog" />
