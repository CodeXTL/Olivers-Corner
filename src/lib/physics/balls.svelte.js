/**
 * The homepage ball pit simulation.
 *
 * Lives here rather than inside `routes/+page.svelte` so the homepage component
 * stays about *the homepage* — copy, links, layout — while the simulation is
 * independently readable and testable. The component's only job is to bind a
 * size, forward pointer events, and render whatever `pit.balls` currently says.
 *
 * The file is `.svelte.js`, not `.js`, because it uses runes. Svelte only
 * compiles rune syntax in files with that extension.
 *
 * @see docs/ARCHITECTURE.md §6
 */

/* -----------------------------------------------------------------------------
   Tunable constants — all in pixels, calibrated for 60fps.
   Adjust these to change how the pit *feels* without touching any logic.
   -------------------------------------------------------------------------- */

/** Ball size. The `.ball` CSS width/height must equal the diameter. */
export const BALL_RADIUS = 25;
export const BALL_DIAMETER = 2 * BALL_RADIUS;

/** Downward acceleration per 60fps frame. */
const GRAVITY = 0.5;
/** Energy kept when bouncing off a wall (1 = perfectly bouncy). */
const BOUNDS_DAMPING = 0.8;
/** Energy kept in a ball-to-ball hit. */
const COLLISION_DAMPING = 0.9;
/** Cap on ball count, so the O(n²) collision pass and the DOM stay cheap. */
const MAX_BALLS = 60;
/** Speed limit when flinging a ball on release. */
const MAX_THROW = 40;

/**
 * Below this viewport width the pit is disabled: there isn't room for it to be
 * fun, and dragging fights with touch scrolling.
 *
 * Kept in sync with the nav's hamburger breakpoint in Nav.svelte.
 */
export const MIN_BALL_WIDTH = 768;

/** Largest time step accepted, in 60fps frames. */
const MAX_DELTA = 3;
/** One 60fps frame in milliseconds. */
const FRAME_MS = 16.6667;

/** @param {number} v @param {number} lo @param {number} hi */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * A ball stores only position and velocity. Its centre is always `x + radius`,
 * computed rather than stored — that removed a whole class of bugs where the
 * cached centre drifted out of sync with the position.
 *
 * @typedef {{ id: number, x: number, y: number, vx: number, vy: number }} Ball
 */

/**
 * Creates a ball pit instance.
 *
 * @returns An object exposing reactive state via getters and the handful of
 *   commands the component needs. State is deliberately not returned directly,
 *   so the component can't mutate it behind the simulation's back.
 */
export function createBallPit() {
	/** @type {Ball[]} */
	let balls = $state([{ id: 0, x: 100 - BALL_RADIUS, y: 100 - BALL_RADIUS, vx: 0, vy: 0 }]);
	let nextId = 1;

	/** Drives reactive styling on the held ball. */
	let draggingId = $state(/** @type {number | null} */ (null));

	/** False until the viewport is measured, so server HTML ships no balls. */
	let enabled = $state(false);

	// Stage size. Measured from the pit element rather than window.innerWidth,
	// which includes the scrollbar and would let balls sit outside the view.
	let width = $state(0);
	let height = $state(0);

	// Drag velocity is plain (non-reactive): it changes every pointermove and
	// nothing renders from it, so making it reactive would only cost work.
	let dragVx = 0;
	let dragVy = 0;

	/** @type {Element | null} */
	let footerEl = null;
	let floorY = 0;

	/**
	 * The footer's top edge is the ground. The footer sits in normal document
	 * flow while the pit is fixed to the viewport, so its position in pit
	 * coordinates changes as the page scrolls — hence re-measuring every frame.
	 */
	function groundLine() {
		if (!footerEl) return height;
		// While the footer is still below the fold, fall back to the bottom of
		// the viewport so balls never drop out of sight.
		return clamp(footerEl.getBoundingClientRect().top, BALL_DIAMETER, height);
	}

	/** Separates overlapping balls and exchanges velocity along the contact normal. */
	function resolveCollisions() {
		for (let i = 0; i < balls.length; i++) {
			for (let j = i + 1; j < balls.length; j++) {
				const a = balls[i];
				const b = balls[j];

				// Difference of top-left corners equals difference of centres.
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

				// Push apart. A held ball stays put and shoves the other.
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

				// Exchange velocity along the normal, but only if closing in —
				// otherwise balls already separating get yanked back together.
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

	/**
	 * Advances the simulation.
	 *
	 * @param {number} dt Time since the last frame, in 60fps frames.
	 */
	function step(dt) {
		if (!width || !height) return; // wait until the stage size is known

		floorY = groundLine();
		resolveCollisions();

		for (const ball of balls) {
			if (ball.id === draggingId) continue; // held balls follow the pointer

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
			} else if (ball.y > floorY - BALL_DIAMETER) {
				// Rest on top of the footer rather than the bottom of the window.
				ball.y = floorY - BALL_DIAMETER;
				ball.vy *= -BOUNDS_DAMPING;
			}
		}
	}

	return {
		get balls() {
			return balls;
		},
		get draggingId() {
			return draggingId;
		},
		get enabled() {
			return enabled;
		},

		/**
		 * Reports the measured stage size. Called from the component whenever its
		 * bound dimensions change.
		 *
		 * @param {number} w @param {number} h
		 */
		resize(w, h) {
			width = w;
			height = h;
		},

		/**
		 * Drops a new ball at a viewport coordinate. Pit coordinates equal client
		 * coordinates because the pit is viewport-fixed.
		 *
		 * @param {number} clientX @param {number} clientY
		 */
		spawn(clientX, clientY) {
			if (!enabled) return;

			balls.push({
				id: nextId++,
				x: clientX - BALL_RADIUS,
				y: clientY - BALL_RADIUS,
				vx: 0,
				vy: 0
			});

			if (balls.length > MAX_BALLS) balls.shift(); // drop the oldest
		},

		/** @param {number} id */
		grab(id) {
			draggingId = id;
			dragVx = 0;
			dragVy = 0;
		},

		/** @param {number} clientX @param {number} clientY */
		drag(clientX, clientY) {
			if (draggingId === null) return;

			const ball = balls.find((b) => b.id === draggingId);
			if (!ball) return;

			const nx = clamp(clientX - BALL_RADIUS, 0, width - BALL_DIAMETER);
			const ny = clamp(clientY - BALL_RADIUS, 0, floorY - BALL_DIAMETER);

			// Exponentially smoothed pointer velocity, so the release throw
			// reflects the gesture's overall direction rather than the last
			// jittery millisecond of it.
			dragVx = 0.6 * dragVx + 0.4 * (nx - ball.x);
			dragVy = 0.6 * dragVy + 0.4 * (ny - ball.y);

			ball.x = nx;
			ball.y = ny;
			ball.vx = 0;
			ball.vy = 0;
		},

		/** Converts the smoothed drag velocity into a throw. */
		release() {
			if (draggingId === null) return;

			const ball = balls.find((b) => b.id === draggingId);
			if (ball) {
				ball.vx = clamp(dragVx, -MAX_THROW, MAX_THROW);
				ball.vy = clamp(dragVy, -MAX_THROW, MAX_THROW);
			}

			draggingId = null;
		},

		/**
		 * Starts the simulation: watches the width breakpoint, finds the footer,
		 * and runs the animation loop.
		 *
		 * @returns {() => void} Teardown, to be returned from the caller's `$effect`.
		 */
		start() {
			footerEl = document.querySelector('.site-footer');

			const query = window.matchMedia(`(min-width: ${MIN_BALL_WIDTH}px)`);
			const sync = () => (enabled = query.matches);
			sync();
			query.addEventListener('change', sync);

			let raf = 0;
			let last = 0;

			/** @param {number} now */
			const loop = (now) => {
				// dt is measured in 60fps frames and clamped, so the sim runs at the
				// same speed on a 60Hz or 144Hz display and a backgrounded tab can't
				// accumulate a huge jump that flings everything off-screen.
				const dt = last ? Math.min((now - last) / FRAME_MS, MAX_DELTA) : 1;
				last = now;

				if (enabled) step(dt);
				raf = requestAnimationFrame(loop);
			};

			raf = requestAnimationFrame(loop);

			return () => {
				cancelAnimationFrame(raf);
				query.removeEventListener('change', sync);
			};
		}
	};
}
