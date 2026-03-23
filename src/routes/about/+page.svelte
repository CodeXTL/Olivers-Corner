<script>
	import { onMount } from 'svelte';

	let profileImage = '/headshot.jpg';

	// Canvas variables
	let canvas;
	let ctx;
	let isDrawing = false;

	// Variable to track the canvas's physical size
	let cWidth;
	let cHeight;

	// This runs once upon load to set up our paintbrush
	onMount(() => {
		ctx = canvas.getContext('2d');
	});

	$: if (canvas && cWidth && cHeight) {
		canvas.width = cWidth;
		canvas.height = cHeight;
	}

	function startDrawing(event) {
		if (event.button != 0) return;

		isDrawing = true;
		draw(event);
	}

	function stopDrawing() {
		isDrawing = false;
		ctx.beginPath();
	}

	function clearDrawing() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function draw(event) {
		if (!isDrawing) return;

		// Get mouse coordinates relative to the canvas itself
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		// Paintbrush settings
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.strokeStyle = '#ff0055';

		// Tells the canvas to draw a line from the last point to the nex (x,y)
		ctx.lineTo(x, y);

		// Actually paints the line onto the screen
		ctx.stroke();

		// Reset the path so the line follows the mouse
		ctx.beginPath();
		ctx.moveTo(x, y);
	}
</script>

<svelte:head>
	<title>About Me | Oliver's Corner</title>
</svelte:head>

<div class="interactive-art-station">
	<img src={profileImage} alt="Hey it's me!" class="base-image" />

	<canvas
		class="drawing-canvas"
		bind:this={canvas}
		bind:clientWidth={cWidth}
		bind:clientHeight={cHeight}
		on:mousedown={startDrawing}
		on:mousemove={draw}
		on:mouseup={stopDrawing}
		on:mouseleave={stopDrawing}
		on:contextmenu|preventDefault={clearDrawing}
	></canvas>
</div>

<div class="page-wrapper">
	<main>
		<h1>About Me</h1>

		<p>
			I am a Computer Science graduate currently pursuing a 2nd Bachelors in Electrical Engineering
			at Georgia Tech. At the moment, I hold a particular interest in integrated circuits, embedded
			systems, and semiconductor devices, but that might change as my mind likes to wonder and fate
			loves to offer surprises.
		</p>
		<p>
			My academic and project work centers around building systems from the ground up, ranging from
			low-level hardware design to higher-level software integration. I enjoy tackling complex
			technical problems that require both theoretical understanding and hands-on implementation.
			Whether working with circuit design, computer vision, or system-level architecture, I am
			driven by the challenge of turning abstract concepts into functional systems.
		</p>
		<p>
			Beyond academics, I am constantly exploring new tools, frameworks, and technologies to expand
			my skill set (for example, this site is made with Svelte, which I have no experience with but
			chose to use cause I thought it would be fun). I value efficiency, structured thinking, and
			continuous improvement, and I aim to build solutions that are both technically robust and
			practically useful.
		</p>
		<p>And that's me on the right! Feel free to draw on me!</p>
		<ul>
			<li>Left click to draw.</li>
			<li>Right click to clear.</li>
		</ul>
	</main>
</div>

<style>
	/* The wrapper takes over the floating duties */
	.interactive-art-station {
		position: fixed;
		right: 10vw;
		top: 50%;
		transform: translateY(-50%);
		width: 350px;
		max-width: 30vw;
		z-index: 1;
	}

	.base-image {
		width: 100%;
		display: block; /* Removes a tiny gap under the image */
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		z-index: 0;
	}

	/* The canvas perfectly covers the image */
	.drawing-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		cursor: crosshair; /* Changes the mouse to look like a tool! */
	}

	/* Responsive design: What happens on small screens? */
	@media (max-width: 1420px) {
		.interactive-art-station {
			display: none;
		}
	}
</style>
