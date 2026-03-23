<script>
	let { children } = $props();
</script>

<nav class="main-nav">
	<a href="/">Home</a>
	<a href="/about">About Me</a>
	<a href="/resume">Resume</a>
	<a href="/goals">Career Goals</a>
	<a href="/projects">Projects</a>
</nav>

<main class="content">
	{@render children()}
</main>

<style>
	.main-nav {
		display: flex;
		gap: 1.5rem;
		padding: 1.5rem 10vw;
		background-color: #eee;
		font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
	}
	.main-nav a {
		text-decoration: none;
		color: #333;
		font-weight: 600;
	}
	.main-nav a:hover {
		color: #000;
	}
	.content {
		/* Gives the rest of the pages a consistent padding */
		padding: 2rem 10vw;
	}
</style>