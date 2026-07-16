<script>
	const name = 'Oliver Lee';
	const links = [
		{ label: 'GitHub', url: 'https://github.com/CodeXTL' },
		{ label: 'Email', url: 'mailto:xli3086@gatech.edu' }
	];

	// --- Tunable physics constants (all in px, calibrated for 60fps) ---
	const BALL_RADIUS = 25;
	const BALL_DIAMETER = 2 * BALL_RADIUS;
	const GRAVITY = 0.5; // downward acceleration per frame
	const BOUNDS_DAMPING = 0.8; // energy kept when bouncing off a wall
	const COLLISION_DAMPING = 0.9; // energy kept in a ball-to-ball hit
	const MAX_BALLS = 60; // cap so collisions/DOM stay cheap
	const MAX_THROW = 40; // clamp on fling speed when releasing a ball

	const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

	// --- Reactive state (Svelte 5 runes) ---
	let width = $state(0);
	let height = $state(0);

	// A ball only stores position + velocity; its center is always x/y + radius.
	let balls = $state([{ id: 0, x: 100 - BALL_RADIUS, y: 100 - BALL_RADIUS, vx: 0, vy: 0 }]);
	let nextId = 1;

	// Drag tracking. draggingId drives reactive styling; the rest are plain vars
	// (they change every pointermove and don't need to trigger renders).
	let draggingId = $state(null);
	let dragVx = 0;
	let dragVy = 0;

	function spawn(event) {
		// Only when clicking the background itself, not the text or a ball.
		if (event.target !== event.currentTarget) return;
		balls.push({
			id: nextId++,
			x: event.clientX - BALL_RADIUS,
			y: event.clientY - BALL_RADIUS,
			vx: 0,
			vy: 0
		});
		if (balls.length > MAX_BALLS) balls.shift(); // drop the oldest
	}

	function grab(event, id) {
		event.stopPropagation(); // don't also spawn a ball
		event.preventDefault(); // avoid text selection / native drag
		draggingId = id;
		dragVx = 0;
		dragVy = 0;
	}

	function drag(event) {
		if (draggingId === null) return;
		const ball = balls.find((b) => b.id === draggingId);
		if (!ball) return;

		const nx = clamp(event.clientX - BALL_RADIUS, 0, width - BALL_DIAMETER);
		const ny = clamp(event.clientY - BALL_RADIUS, 0, height - BALL_DIAMETER);

		// Smooth the pointer movement so the release throw feels natural.
		dragVx = 0.6 * dragVx + 0.4 * (nx - ball.x);
		dragVy = 0.6 * dragVy + 0.4 * (ny - ball.y);

		ball.x = nx;
		ball.y = ny;
		ball.vx = 0;
		ball.vy = 0;
	}

	function release() {
		if (draggingId === null) return;
		const ball = balls.find((b) => b.id === draggingId);
		if (ball) {
			ball.vx = clamp(dragVx, -MAX_THROW, MAX_THROW);
			ball.vy = clamp(dragVy, -MAX_THROW, MAX_THROW);
		}
		draggingId = null;
	}

	function resolveCollisions() {
		for (let i = 0; i < balls.length; i++) {
			for (let j = i + 1; j < balls.length; j++) {
				const a = balls[i];
				const b = balls[j];

				// Difference of top-left corners equals difference of centers.
				let dx = b.x - a.x;
				let dy = b.y - a.y;
				let dist = Math.hypot(dx, dy);
				if (dist === 0) {
					dist = 0.01;
					dx = 0.01; // nudge perfectly-overlapping balls apart
				}
				if (dist >= BALL_DIAMETER) continue;

				const nx = dx / dist;
				const ny = dy / dist;
				const overlap = BALL_DIAMETER - dist;
				const aHeld = a.id === draggingId;
				const bHeld = b.id === draggingId;

				// Push the balls apart; a held ball stays put and shoves the other.
				if (aHeld) {
					b.x += overlap * nx;
					b.y += overlap * ny;
				} else if (bHeld) {
					a.x -= overlap * nx;
					a.y -= overlap * ny;
				} else {
					a.x -= (overlap / 2) * nx;
					a.y -= (overlap / 2) * ny;
					b.x += (overlap / 2) * nx;
					b.y += (overlap / 2) * ny;
				}

				// Exchange velocity along the collision normal (only if closing in).
				const speed = (nx * (a.vx - b.vx) + ny * (a.vy - b.vy)) * COLLISION_DAMPING;
				if (speed > 0) {
					a.vx -= speed * nx;
					a.vy -= speed * ny;
					b.vx += speed * nx;
					b.vy += speed * ny;
				}
			}
		}
	}

	function step(dt) {
		if (!width || !height) return; // wait until the window size is known
		resolveCollisions();

		for (const ball of balls) {
			if (ball.id === draggingId) continue; // held balls are moved by the pointer

			ball.vy += GRAVITY * dt;
			ball.x += ball.vx * dt;
			ball.y += ball.vy * dt;

			if (ball.x < 0) {
				ball.x = 0;
				ball.vx *= -BOUNDS_DAMPING;
			} else if (ball.x > width - BALL_DIAMETER) {
				ball.x = width - BALL_DIAMETER;
				ball.vx *= -BOUNDS_DAMPING;
			}

			if (ball.y < 0) {
				ball.y = 0;
				ball.vy *= -BOUNDS_DAMPING;
			} else if (ball.y > height - BALL_DIAMETER) {
				ball.y = height - BALL_DIAMETER;
				ball.vy *= -BOUNDS_DAMPING;
			}
		}
	}

	// Drive the simulation. dt is measured in 60fps-frames and clamped so a
	// backgrounded tab or slow frame can't fling balls across the screen.
	$effect(() => {
		let raf;
		let last = 0;
		const loop = (now) => {
			const dt = last ? Math.min((now - last) / 16.6667, 3) : 1;
			last = now;
			step(dt);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	});
</script>

<svelte:window
	bind:innerWidth={width}
	bind:innerHeight={height}
	onpointermove={drag}
	onpointerup={release}
/>

<div class="page-wrapper" onpointerdown={spawn} role="presentation">
	<main>
		<header>
			<h1>{name}</h1>
			<p>
				Welcome to my corner of the internet! I am an Electrical Engineering and Computer Science
				student at Georgia Tech with a passion for semiconductor devices, embedded systems, and
				VLSI. This website serves as a creative outlet for me to explore interesting things as well
				as a portfolio of my academic journey, showcasing my technical projects, career aspirations,
				and personal growth.
			</p>
			<p>In the meantime, here's a ball to play around with.</p>
			<ul>
				<li>Grab and drag any ball, then let go to fling it.</li>
				<li>Click any empty space to drop a new ball.</li>
			</ul>
		</header>

		<nav>
			{#each links as link (link.url)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
				<a href={link.url} target="_blank" rel="noreferrer">
					{link.label} <span class="arrow">=></span>
				</a>
			{/each}
		</nav>
	</main>

	{#each balls as ball (ball.id)}
		<div
			class="ball"
			class:grabbing={ball.id === draggingId}
			style:transform="translate({ball.x}px, {ball.y}px){ball.id === draggingId
				? ' scale(1.1)'
				: ''}"
			onpointerdown={(event) => grab(event, ball.id)}
			role="presentation"
		></div>
	{/each}
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

	.ball {
		position: absolute;
		top: 0;
		left: 0;
		width: 50px;
		height: 50px;
		background: #000;
		border-radius: 50%;
		cursor: grab;
		z-index: 10; /* Ensures the ball floats above everything else */
		touch-action: none; /* Let us drag on touchscreens without scrolling */
		user-select: none;
		will-change: transform; /* Hint the browser to composite on the GPU */
	}

	.grabbing {
		cursor: grabbing;
		/* The 1.1 scale is applied inline alongside translate() so the two compose
		   correctly (scale must come after translate, not as a separate property). */
		background: #444;
	}
</style>
