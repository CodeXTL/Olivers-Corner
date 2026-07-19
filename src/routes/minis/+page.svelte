<script>
	import { minis } from '$lib/minis.js';
	import MiniCard from '$lib/components/MiniCard.svelte';
</script>

<svelte:head>
	<title>Minis | Oliver's Corner</title>
</svelte:head>

<main>
	<h1>Mini Projects</h1>

	<p class="intro">
		Smaller builds and experiments — the things that were too quick to earn a full write-up but
		still worth showing.
	</p>

	{#if minis.length}
		<div class="mini-grid">
			{#each minis as mini (mini.slug)}
				<MiniCard {mini} />
			{/each}
		</div>
	{:else}
		<p>No mini projects yet — check back soon.</p>
	{/if}
</main>

<style>
	main {
		padding: 10vw;
	}

	.intro {
		max-width: 640px;
		margin-bottom: 2.5rem;
	}

	.mini-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}

	/* Three columns is the target; step down rather than squash the cards. */
	@media (max-width: 1000px) {
		.mini-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.mini-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
