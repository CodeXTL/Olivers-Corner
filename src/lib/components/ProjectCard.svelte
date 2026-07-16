<script>
	// A single project entry on the /projects listing, driven by frontmatter data.
	import CategoryList from './CategoryList.svelte';

	let { project } = $props();
</script>

<article class="project-block">
	<a class="project-thumbnail" href="/projects/{project.slug}">
		<img src={project.thumbnail} alt="{project.title} thumbnail" />
	</a>

	<div class="project-info">
		<h2>{project.title}</h2>
		<p><strong>Completion Date:</strong> {project.completion}</p>
		<p>
			<strong>Overview:</strong>
			{project.overview}
			<a href="/projects/{project.slug}">Read more!</a>
		</p>
		<CategoryList categories={project.categories} />
	</div>
</article>

<style>
	.project-block {
		display: flex;
		gap: 2rem;
		background-color: #fff;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 2.5rem;
		align-items: flex-start;
	}

	.project-thumbnail {
		flex: 0 0 200px;
	}

	.project-thumbnail img {
		width: 100%;
		height: auto;
		border-radius: 8px;
		object-fit: cover;
		aspect-ratio: 4 / 3;
		border: 1px solid #eaeaea;
	}

	.project-info {
		flex: 1;
	}

	.project-info h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		border-bottom: none;
		padding-bottom: 0;
	}

	@media (max-width: 600px) {
		.project-block {
			flex-direction: column;
			gap: 1rem;
		}

		.project-thumbnail {
			flex: 1 1 auto;
			width: 100%;
		}
	}
</style>
