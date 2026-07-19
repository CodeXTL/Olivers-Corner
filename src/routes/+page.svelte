<script>
	// The homepage: intro copy, social links, and the ball pit.
	//
	// The simulation itself lives in $lib/physics/balls.svelte.js — this file
	// only measures the stage, forwards pointer events, and renders the balls.
	import { createBallPit, BALL_RADIUS } from '$lib/physics/balls.svelte.js';
	import { site, socialLinks } from '$lib/config.js';
	import Seo from '$lib/components/Seo.svelte';

	const pit = createBallPit();

	// Stage size, measured from .ball-pit rather than window.innerWidth, which
	// includes the scrollbar and would let balls sit outside the visible area.
	let width = $state(0);
	let height = $state(0);

	$effect(() => pit.resize(width, height));
	$effect(() => pit.start());

	/** @param {PointerEvent & { currentTarget: EventTarget }} event */
	function handleBackgroundPointerDown(event) {
		// Only when pressing the background itself, not the text or a ball.
		if (event.target !== event.currentTarget) return;
		pit.spawn(event.clientX, event.clientY);
	}

	/** @param {PointerEvent} event @param {number} id */
	function handleBallPointerDown(event, id) {
		event.stopPropagation(); // don't also spawn a ball
		event.preventDefault(); // avoid text selection / native drag
		pit.grab(id);
	}
</script>

<Seo />

<svelte:window
	onpointermove={(event) => pit.drag(event.clientX, event.clientY)}
	onpointerup={() => pit.release()}
/>

<div class="page" onpointerdown={handleBackgroundPointerDown} role="presentation">
	<main>
		<header>
			<h1>{site.author}</h1>
			<p>
				Welcome to my corner of the internet! I am an Electrical Engineering and Computer Science
				student at Georgia Tech with a passion for semiconductor devices, embedded systems, and
				VLSI. This website serves as an outlet for me to explore interesting things as well as a
				portfolio of my academic journey, showcasing my technical projects, career aspirations, and
				personal growth.
			</p>

			{#if pit.enabled}
				<p>
					Note that this website it still under heavy development. In the meantime, here's a ball to
					play around with.
				</p>
				<ul>
					<li>Grab and drag any ball, then let go to fling it.</li>
					<li>Click any empty space to drop a new ball.</li>
					<li>Ball dropping only works on wider screens, so it's off on phones.</li>
				</ul>
			{:else}
				<p>
					Note that this website it still under heavy development. In the meantime, there's a ball
					pit to play around with here, but ball dropping only works on wider screens, so try this
					page on a desktop.
				</p>
			{/if}
		</header>

		<nav>
			{#each socialLinks as link (link.href)}
				<a href={link.href} target="_blank" rel="noreferrer">
					{link.label} <span class="arrow">=></span>
				</a>
			{/each}
		</nav>
	</main>

	<!-- Fixed and clipped, so balls can never grow the page's scrollable area.
	     Being viewport-anchored also makes ball coordinates line up with the
	     pointer's clientX/clientY no matter how far the page is scrolled. -->
	<div class="ball-pit" bind:clientWidth={width} bind:clientHeight={height} aria-hidden="true">
		{#if pit.enabled}
			{#each pit.balls as ball (ball.id)}
				<div
					class="ball"
					class:grabbing={ball.id === pit.draggingId}
					style:transform="translate({ball.x}px, {ball.y}px){ball.id === pit.draggingId
						? ' scale(1.1)'
						: ''}"
					style:--ball-size="{BALL_RADIUS * 2}px"
					onpointerdown={(event) => handleBallPointerDown(event, ball.id)}
					role="presentation"
				></div>
			{/each}
		{/if}
	</div>
</div>

<style>
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	a {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		text-decoration: none;
		color: var(--color-text-subtle);
		font-size: 0.9rem;
		width: fit-content;
		transition: color var(--duration-base) var(--ease);
	}

	.arrow {
		font-size: 0.8rem;
		opacity: 0;
		transform: translateX(-5px);
		transition: all var(--duration-base) var(--ease);
	}

	a:hover {
		color: var(--color-text-strong);
	}

	a:hover .arrow {
		opacity: 1;
		transform: translateX(0);
	}

	/* The stage the balls live on. Fixed + hidden overflow means it never
	   contributes to document height/width, so no stray scrollbars. */
	.ball-pit {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: 10; /* floats above the page content */
		pointer-events: none; /* never swallow clicks meant for the page */
	}

	.ball {
		position: absolute;
		top: 0;
		left: 0;
		/* Driven by BALL_RADIUS so the CSS can't drift from the physics. */
		width: var(--ball-size);
		height: var(--ball-size);
		background: var(--color-text-strong);
		border-radius: 50%;
		cursor: grab;
		pointer-events: auto; /* ...but the balls themselves stay grabbable */
		touch-action: none; /* drag on touchscreens without scrolling */
		user-select: none;
		will-change: transform; /* hint the browser to composite on the GPU */
	}

	.grabbing {
		cursor: grabbing;
		background: #444;
		/* NOTE: the 1.1 scale is applied inline alongside translate() so the two
		   compose correctly. Don't move it to the standalone `scale:` property —
		   that applies before `transform`, multiplying the translate and shifting
		   the ball off the cursor by ~0.1x its position. */
	}
</style>
