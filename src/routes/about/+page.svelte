<script>
	// The headshot has a transparent canvas layered over it that visitors can
	// scribble on. Migrated to Svelte 5 runes and pointer events, so it now works
	// with a finger or stylus rather than a mouse only.
	import Seo from '$lib/components/Seo.svelte';

	const BRUSH_WIDTH = 5;

	/** @type {HTMLCanvasElement | undefined} */
	let canvas = $state();
	/** @type {CanvasRenderingContext2D | null} */
	let ctx = null;

	let isDrawing = $state(false);

	// The canvas is sized by CSS, but its drawing buffer must be set in pixels or
	// strokes land offset from the cursor. Bound here, applied by the effect below.
	let cssWidth = $state(0);
	let cssHeight = $state(0);

	// Re-runs whenever the element mounts or its measured size changes. Assigning
	// width/height also clears the canvas, which is why the context is re-fetched
	// alongside it rather than once on mount.
	$effect(() => {
		if (!canvas || !cssWidth || !cssHeight) return;

		canvas.width = cssWidth;
		canvas.height = cssHeight;
		ctx = canvas.getContext('2d');
	});

	/** @param {PointerEvent} event */
	function startDrawing(event) {
		if (event.button !== 0 || !canvas) return;

		isDrawing = true;
		// Keeps receiving move events even if the pointer leaves the canvas
		// mid-stroke, so a fast scribble doesn't break into segments.
		canvas.setPointerCapture(event.pointerId);
		draw(event);
	}

	function stopDrawing() {
		isDrawing = false;
		ctx?.beginPath();
	}

	function clearDrawing() {
		if (!canvas || !ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	/** @param {PointerEvent} event */
	function draw(event) {
		if (!isDrawing || !canvas || !ctx) return;

		// Pointer coordinates are viewport-relative; the canvas needs its own.
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		ctx.lineWidth = BRUSH_WIDTH;
		ctx.lineCap = 'round';
		ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--color-accent').trim();

		ctx.lineTo(x, y);
		ctx.stroke();

		// Restart the path at the cursor so the line follows continuously.
		ctx.beginPath();
		ctx.moveTo(x, y);
	}
</script>

<Seo
	title="About Me"
	description="Oliver Lee — Computer Science graduate pursuing a second Bachelor's in Electrical Engineering at Georgia Tech, interested in integrated circuits, embedded systems, and semiconductor devices."
/>

<div class="art-station">
	<img src="/headshot.jpg" alt="Oliver Lee" class="base-image" />

	<canvas
		class="drawing-canvas"
		aria-label="Scribble over the photo. Left click to draw, right click to clear."
		bind:this={canvas}
		bind:clientWidth={cssWidth}
		bind:clientHeight={cssHeight}
		onpointerdown={startDrawing}
		onpointermove={draw}
		onpointerup={stopDrawing}
		onpointercancel={stopDrawing}
		oncontextmenu={(event) => {
			event.preventDefault();
			clearDrawing();
		}}
	></canvas>
</div>

<div class="page">
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
	.art-station {
		position: fixed;
		right: var(--page-gutter);
		top: 50%;
		transform: translateY(-50%);
		width: 350px;
		max-width: 30vw;
		z-index: 1;
	}

	.base-image {
		width: 100%;
		display: block; /* removes a tiny gap under the image */
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-lg);
	}

	/* The canvas sits exactly over the image. */
	.drawing-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: var(--radius-xl);
		cursor: crosshair;
		/* Stops the browser panning/zooming instead of drawing on touch. */
		touch-action: none;
	}

	/* Below this width the prose column would collide with the photo. */
	@media (max-width: 1420px) {
		.art-station {
			display: none;
		}
	}
</style>
