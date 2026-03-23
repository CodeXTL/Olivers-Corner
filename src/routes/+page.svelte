<script>
	import { onMount } from 'svelte';

	const name = 'Oliver Lee';
	const links = [
		{ label: 'GitHub', url: 'https://github.com/CodeXTL' },
		{ label: 'Email', url: 'mailto:xli3086@gatech.edu' }
	];

	// Window dimensions
	let w_width;
	let w_height;

	// Some state vars
	let is_dragging = false;

	// Ball params
	let ball_radius = 25;
	let ball_diameter = 2 * ball_radius;
	let curr_id = 0;

	// Array to hold the state of all balls
	let balls = [
		{
			id: 0,
			x: 100,
			y: 100,
			x_center: 100 - ball_radius,
			y_center: 100 - ball_radius,
			x_vel: 0,
			y_vel: 0,
			is_dragging: false
		}
	];

	// Environment params
	let g = 0.5;
	let bounds_damping_factor = 0.8;
	let collision_damping_factor = 0.9;

	function startDrag(event, id) {
		if (event.button == 0) {
			for (let ball of balls) {
				if (ball.id == id) {
					ball.is_dragging = true;
					break;
				}
			}
		}
	}

	function stopDrag() {
		for (let ball of balls) {
			if (ball.is_dragging) {
				ball.is_dragging = false;
				break;
			}
		}
	}

	function onDrag(event) {
		for (let ball of balls) {
			if (ball.is_dragging) {
				// event.clientX and clientY give the exact pixel coordinates of the mouse.
				if (event.clientX >= ball_radius * 1.1 && event.clientX < w_width - ball_radius * 1.1) {
					ball.x = event.clientX - ball_radius;
					ball.x_center = event.clientX;
				}
				if (event.clientY >= ball_radius * 1.1 && event.clientY < w_height - ball_radius * 1.1) {
					ball.y = event.clientY - ball_radius;
					ball.y_center = event.clientY;
				}
				break;
			}
		}
		balls = balls; // Trigger Svelte to update HTML
	}

	function spawnBall(event) {
		if (event.button == 0) {
			curr_id += 1;
			let new_ball = {
				id: curr_id,
				x: event.clientX - ball_radius,
				y: event.clientY - ball_radius,
				x_center: event.clientX,
				y_center: event.clientY,
				x_vel: 0,
				y_vel: 0,
				is_dragging: false
			};
			balls.push(new_ball);
			balls = balls; // Trigger Svelte to update HTML
		}
	}

	// Physics stuff

	function checkBallCollisions() {
		for (let i = 0; i < balls.length; i++) {
			for (let j = i + 1; j < balls.length; j++) {
				let ballA = balls[i];
				let ballB = balls[j];

				let dist_btwn_centers = Math.sqrt(
					(ballA.x_center - ballB.x_center) ** 2 + (ballA.y_center - ballB.y_center) ** 2
				);
				if (dist_btwn_centers <= ball_diameter) {
					// Normal vector from A to B
					let nx = (ballB.x_center - ballA.x_center) / dist_btwn_centers;
					let ny = (ballB.y_center - ballA.y_center) / dist_btwn_centers;

					// Ensure correct ball positioning to prevent clumping
					let overlap = ball_diameter - dist_btwn_centers;
					if (overlap > 0) {
						if (ballA.is_dragging) {
							ballB.x += overlap * nx;
							ballB.y += overlap * ny;
							ballB.x_center += overlap * nx;
							ballB.y_center += overlap * ny;
						} else if (ballB.is_dragging) {
							ballA.x -= overlap * nx;
							ballA.y -= overlap * ny;
							ballA.x_center -= overlap * nx;
							ballA.y_center -= overlap * ny;
						} else {
							ballA.x -= (overlap / 2) * nx;
							ballA.y -= (overlap / 2) * ny;
							ballA.x_center -= (overlap / 2) * nx;
							ballA.y_center -= (overlap / 2) * ny;

							ballB.x += (overlap / 2) * nx;
							ballB.y += (overlap / 2) * ny;
							ballB.x_center += (overlap / 2) * nx;
							ballB.y_center += (overlap / 2) * ny;
						}
					}

					// Compute velocity of A relative to B
					let d_vx = ballA.x_vel - ballB.x_vel;
					let d_vy = ballA.y_vel - ballB.y_vel;

					// Compute speed along normal vector
					let speed = (nx * d_vx + ny * d_vy) * collision_damping_factor;

					// If positive speed in the direction head-on the collision, update velocities accordingly
					if (speed > 0) {
						ballA.x_vel -= speed * nx;
						ballA.y_vel -= speed * ny;
						ballB.x_vel += speed * nx;
						ballB.y_vel += speed * ny;
					}
				}
			}
		}
		balls = balls; // Trigger Svelte to update HTML
	}

	function physicsLoop() {
		checkBallCollisions();
		for (let ball of balls) {
			if (!ball.is_dragging) {
				// Update horizontal (x) coord, with bounds checking
				ball.x += ball.x_vel;
				if (ball.x < 0) {
					ball.x = 0;
					ball.x_vel *= -bounds_damping_factor;
				} else if (ball.x > w_width - ball_diameter) {
					ball.x = w_width - ball_diameter;
					ball.x_vel *= -bounds_damping_factor;
				}
				// Update horizontal (x) center coord
				ball.x_center = ball.x + ball_radius;

				// Update vertical (y) coord, with bounds checking
				ball.y_vel += g;
				ball.y += ball.y_vel;
				ball.y_center = ball.y + ball_radius;
				if (ball.y < 0) {
					ball.y = 0;
					ball.y_vel *= -bounds_damping_factor;
				} else if (ball.y > w_height - ball_diameter) {
					ball.y = w_height - ball_diameter;
					ball.y_vel *= -bounds_damping_factor;
				}
				// Update vertical (y) center coord
				ball.y_center = ball.y + ball_radius;
			} else {
				ball.x_vel = 0;
				ball.y_vel = 0;
			}
		}
		balls = balls; // Trigger Svelte to update HTML
		requestAnimationFrame(physicsLoop);
	}

	onMount(() => {
		physicsLoop();
	});
</script>

<svelte:window
	bind:innerWidth={w_width}
	bind:innerHeight={w_height}
	on:mousemove={onDrag}
	on:mouseup={stopDrag}
/>

<div class="wrapper" on:mousedown|self={spawnBall} role="presentation">
	<main>
		<header>
			<h1>{name}</h1>
			<p>
				Welcome to my corner of the internet! I am an Electrical Engineering and Computer Science
				student at Georgia Tech with a passion for semiconductor devices and VLSI. This website
				serves as a creative outlet for me to explore interesting things as well as a portfolio of
				my academic journey, showcasing my technical projects, career aspirations, and personal
				growth.
			</p>
			<p>In the meantime, here's a ball to play around with.</p>
			<ul>
				<li>Click on any ball to drag it.</li>
				<li>Click on any blank space to spawn more balls.</li>
			</ul>
		</header>

		<nav>
			{#each links as link}
				<a href={link.url} target="_blank" rel="noreferrer">
					{link.label} <span class="arrow">=></span>
				</a>
			{/each}
		</nav>
	</main>

	{#each balls as ball}
		<div
			class="ball"
			draggable="false"
			class:grabbing={ball.is_dragging}
			style:left="{ball.x}px"
			style:top="{ball.y}px"
			on:mousedown|stopPropagation|preventDefault={(event) => startDrag(event, ball.id)}
			role="presentation"
		></div>
	{/each}

	<footer>
		<p>No, I am your footer.</p>
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
		margin-bottom: 1rem;
		color: #333;
	}

	li {
		font-size: 1.25rem;
		line-height: 1.5;
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
		z-index: 10; /* Ensures the ball floats above everything else */
	}

	.grabbing {
		cursor: grabbing;
		transform: scale(1.1);
		background: #444;
	}
</style>
