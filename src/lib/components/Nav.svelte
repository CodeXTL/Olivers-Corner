<script>
	// Site nav. Above the breakpoint it is a plain horizontal row; below it the
	// links collapse behind a hamburger toggle. Breakpoint is kept in sync with
	// MIN_BALL_WIDTH on the homepage.
	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About Me' },
		{ href: '/resume', label: 'Resume' },
		{ href: '/goals', label: 'Career Goals' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/minis', label: 'Minis' }
	];

	let open = $state(false);
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') open = false;
	}}
/>

<nav class="main-nav">
	<button
		class="menu-toggle"
		aria-label={open ? 'Close menu' : 'Open menu'}
		aria-expanded={open}
		aria-controls="nav-links"
		onclick={() => (open = !open)}
	>
		<span class="bars" class:open aria-hidden="true">
			<span></span>
			<span></span>
			<span></span>
		</span>
	</button>

	<div id="nav-links" class="nav-links" class:open>
		{#each links as link (link.href)}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- internal site link -->
			<a href={link.href} onclick={() => (open = false)}>{link.label}</a>
		{/each}
	</div>
</nav>

<style>
	.main-nav {
		/**Floats the nav bar to fix the homepage issue*/
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 100;
		/* It's yee high and above everything */

		padding: 1.5rem 10vw;
		background-color: #eee;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
	}

	.main-nav a {
		text-decoration: none;
		color: #333;
		font-weight: 600;
	}

	.main-nav a:hover {
		color: #000;
	}

	/* Hidden on wide screens; the links speak for themselves there. */
	.menu-toggle {
		display: none;
		background: none;
		border: none;
		padding: 0.25rem;
		margin: 0;
		cursor: pointer;
		color: #333;
	}

	.bars {
		display: block;
		width: 24px;
	}

	.bars span {
		display: block;
		height: 2px;
		background-color: currentColor;
		border-radius: 2px;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.bars span + span {
		margin-top: 5px;
	}

	/* Morph the three bars into an X while the menu is open. */
	.bars.open span:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.bars.open span:nth-child(2) {
		opacity: 0;
	}

	.bars.open span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	@media (max-width: 767px) {
		.main-nav {
			padding: 1rem 6vw;
		}

		.menu-toggle {
			display: block;
		}

		.nav-links {
			display: none;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem 0 0.25rem;
		}

		.nav-links.open {
			display: flex;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bars span {
			transition: none;
		}
	}
</style>
