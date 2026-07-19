<script>
	import ProjectLayout from '$lib/components/ProjectLayout.svelte';

	let { data } = $props();
	let Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} | Oliver's Corner</title>
</svelte:head>

<ProjectLayout meta={data.meta} backHref="/minis" backLabel="Back to Minis">
	<Content />
</ProjectLayout>
