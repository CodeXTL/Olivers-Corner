<script>
	// Site nav. Above the breakpoint it is a plain horizontal row; below it the
	// links collapse behind a hamburger toggle. Breakpoint is kept in sync with
	// MIN_BALL_WIDTH in $lib/physics/balls.svelte.js.
	//
	// The link list is NOT declared here — it comes from $lib/config.js, where
	// the collection entries are derived from the content registry. That way a
	// new content type appears in the nav automatically.
	import { page } from '$app/state';
	import { navLinks } from '$lib/config.js';

	let open = $state(false);

	/**
	 * Whether a nav link points at the page currently being viewed. Section
	 * links stay highlighted on their child pages (`/projects/mousecam` keeps
	 * "Projects" marked), while "Home" only matches an exact `/`.
	 *
	 * @param {string} href
	 */
	function isCurrent(href) {
		const path = page.url.pathname;
		return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
	}
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
		{#each navLinks as link (link.href)}
			<a
				href={link.href}
				class:current={isCurrent(link.href)}
				aria-current={isCurrent(link.href) ? 'page' : undefined}
				onclick={() => (open = false)}
			>
				{link.label}
			</a>
		{/each}
	</div>
</nav>

<style>
	.main-nav {
		/* Fixed so the homepage balls can pass underneath it. */
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: var(--z-nav);

		padding: var(--space-6) var(--page-gutter);
		background-color: var(--color-surface-bar);
	}

	.nav-links {
		display: flex;
		gap: var(--space-6);
	}

	.main-nav a {
		text-decoration: none;
		color: var(--color-text);
		font-weight: var(--weight-semibold);
	}

	.main-nav a:hover {
		color: var(--color-text-strong);
	}

	/* Marks the section you're currently in. Paired with aria-current="page",
	   so it reads correctly to screen readers as well as visually. */
	.main-nav a.current {
		color: var(--color-text-strong);
		text-decoration: underline;
		text-underline-offset: 0.3em;
	}

	/* Hidden on wide screens; the links speak for themselves there. */
	.menu-toggle {
		display: none;
		background: none;
		border: none;
		padding: var(--space-1);
		margin: 0;
		cursor: pointer;
		color: var(--color-text);
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
			transform var(--duration-base) var(--ease),
			opacity var(--duration-base) var(--ease);
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
			padding: var(--space-4) var(--page-gutter);
		}

		.menu-toggle {
			display: block;
		}

		.nav-links {
			display: none;
			flex-direction: column;
			gap: var(--space-4);
			padding: var(--space-4) 0 var(--space-1);
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
