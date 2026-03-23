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

{@render children()}

<style>
	.main-nav {
		/**Floats the nav bar to fix the homepage issue*/
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 100; /* It's yee high and above everything */

		display: flex;
		gap: 1.5rem;
		padding: 1.5rem 10vw;
		background-color: #eee;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			sans-serif;
	}
	.main-nav a {
		text-decoration: none;
		color: #333;
		font-weight: 600;
	}
	.main-nav a:hover {
		color: #000;
	}

	/* --- GLOBAL TYPOGRAPHY --- */
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #fafafa;
		color: #111;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			sans-serif;
	}

	:global(h1) {
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 1.5rem;
		color: #000;
	}

	:global(h2) {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		color: #111;
		border-bottom: 1px solid #eaeaea;
		padding-bottom: 0.5rem;
	}

	:global(p),
	:global(li) {
		font-size: 1.25rem;
		line-height: 1.5;
		margin-bottom: 1rem;
		color: #333;
	}

	/* --- SHARED PAGE LAYOUT --- */
	/* This perfectly mimics your homepage wrapper */
	:global(.page-wrapper) {
		display: flex;
		flex-direction: column;
		padding: 10vw 0 5vw 10vw;
	}

	/* This perfectly mimics your homepage main tag */
	:global(.page-wrapper main) {
		max-width: 640px;
	}
</style>
