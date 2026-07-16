<script>
	import { projects } from '$lib/projects.js';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
</script>

<svelte:head>
	<title>Projects | Oliver's Corner</title>
</svelte:head>

<main>
	<h1>Technical Projects</h1>

	{#each projects as project (project.slug)}
		<ProjectCard {project} />
	{/each}
</main>

<style>
	main {
		padding: 10vw;
	}
</style>
