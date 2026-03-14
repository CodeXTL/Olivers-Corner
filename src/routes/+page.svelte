<script>
  import { onMount } from "svelte";

	const name = 'Oliver Lee';
	const bio =
		"Hello, welcome to my website! This is a work-in-progress, so it's a bit lonely at the moment.";
	const links = [
		{ label: "GitHub", url: 'https://github.com/CodeXTL' },
		{ label: 'Email', url: 'mailto:xli3086@gatech.edu' }
	];

	// Window dimensions
	let windowWidth;
	let windowHeight;

	// Ball params
	let ball_radius = 25;
  let ball_diameter = 2*ball_radius;
	let x = 100;
	let y = 100;
  let vx = 0;
  let vy = 0;
	let isDragging = false;

  // Environment params
  let g = 0.5;

	function startDrag() {
		isDragging = true;
	}

	function stopDrag() {
		isDragging = false;
	}

	function onDrag(event) {
		if (isDragging) {
			// event.clientX and clientY give the exact pixel coordinates of the mouse.
			if (event.clientX >= ball_radius*1.1 && event.clientX < windowWidth - ball_radius*1.1)
				x = event.clientX - ball_radius;
			if (event.clientY >= ball_radius*1.1 && event.clientY < windowHeight - ball_radius*1.1)
				y = event.clientY - ball_radius;
		}
	}

  function physicsLoop() {
    if (!isDragging) {
      vy += g;
      y += vy
      if (y > windowHeight - ball_diameter) {
        y = windowHeight - ball_diameter;
        vy *= -0.8;
      }
    } else {
      vy = 0;
    }
    requestAnimationFrame(physicsLoop);
  }

  onMount(() => {
    physicsLoop();
  })
</script>

<svelte:window
	bind:innerWidth={windowWidth}
	bind:innerHeight={windowHeight}
	on:mousemove={onDrag}
	on:mouseup={stopDrag}
/>

<div class="wrapper">
	<main>
		<header>
			<h1>{name}</h1>
			<p>{bio}</p>
		</header>

		<nav>
			{#each links as link}
				<a href={link.url} target="_blank" rel="noreferrer">
					{link.label} <span class="arrow">=></span>
				</a>
			{/each}
		</nav>
	</main>

	<div
		class="ball"
		class:grabbing={isDragging}
		style:left="{x}px"
		style:top="{y}px"
		on:mousedown={startDrag}
		role="presentation"
	></div>

	<footer>
		<p>Hi, I'm a footer!</p>
	</footer>
</div>

<style>
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

	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 100vh;
		padding: 0 10vw;
	}

	main {
		max-width: 480px;
	}

	h1 {
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 1.5rem;
		color: #000;
	}

	p {
		font-size: 1.25rem;
		line-height: 1.5;
		margin-bottom: 2.5rem;
		color: #333;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: #888;
		font-size: 0.9rem;
		width: fit-content;
		transition: color 0.2s ease;
	}

	.arrow {
		font-size: 0.8rem;
		opacity: 0;
		transform: translateX(-5px);
		transition: all 0.2s ease;
	}

	a:hover {
		color: #000;
	}

	a:hover .arrow {
		opacity: 1;
		transform: translateX(0);
	}

	footer {
		position: absolute;
		bottom: 2rem;
		font-size: 0.7rem;
		color: #bbb;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.ball {
		width: 50px;
		height: 50px;
		background: #000;
		border-radius: 50%;
		position: absolute;
		cursor: grab;
		user-select: none; /* Stops text highlighting while dragging */
		z-index: 10; /* Ensures the ball floats above everything else */
	}

	.grabbing {
		cursor: grabbing;
		transform: scale(1.1);
		background: #444;
	}
</style>
