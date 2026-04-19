<svelte:head>
	<title>Projects | Oliver's Corner</title>
</svelte:head>

<main>
	<h1>Technical Projects</h1>

	<div class="project-block">
		<a class="project-thumbnail" href="/projects/project-mouse-camera">
			<img src="/project-mouse-camera/Thumbnail.jpg" alt="Mouse camera thumbnail" />
		</a>

		<div class="project-info">
			<h2>MouseCam: Imaging from an Optical Mouse Sensor</h2>
			<p>
				<strong>Completion Date:</strong> April 2026
			</p>
			<p>
				<strong>Overview:</strong> MouseCam is a project with the goal of extracting live image data
				from the optical sensor inside a 20-year-old Logitech mouse and streaming it wirelessly to a
				PC for display. <a href="/projects/project-mouse-camera">Read more!</a>
			</p>
		</div>
	</div>

	<div class="project-block">
		<a class="project-thumbnail" href="/projects/project-camera">
			<img src="/project-camera/Thumbnail.jpg" alt="DIY camera thumbnail" />
		</a>

		<div class="project-info">
			<h2>PixShift: A DIY Camera</h2>
			<p>
				<strong>Completion Date:</strong> November 2025
			</p>
			<p>
				<strong>Overview:</strong> Creating a portable camera with a custom 8 by 8 pixel camera
				sensor that is mounted on a linear actuator so that images at a higher resolution (16 by 8
				pixels) can be obtained. <a href="/projects/project-camera">Read more!</a>
			</p>
		</div>
	</div>
</main>

<style>
	main {
		padding: 10vw 10vw 10vw 10vw;
	}

	/* The main container for each project */
	.project-block {
		display: flex; /* Puts the child divs side-by-side */
		gap: 2rem; /* Adds 2rem of space between the image and the text */
		background-color: #fff; /* Gives it a clean white background against your #fafafa body */
		padding: 1.5rem; /* Breathing room inside the block */
		border-radius: 12px; /* Soft rounded corners */
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* A subtle floating shadow */
		margin-bottom: 2.5rem; /* Space between this project and the next one */
		align-items: flex-start; /* Keeps the text aligned to the top of the image */
	}

	/* The left column for the image */
	.project-thumbnail {
		flex: 0 0 200px; /* Fixes the width to exactly 200px. It won't shrink or grow. */
	}

	.project-thumbnail img {
		width: 100%;
		height: auto;
		border-radius: 8px; /* Slightly rounds the image corners to match the block */
		object-fit: cover; /* Ensures the image fills its space without stretching weirdly */
		aspect-ratio: 4 / 3; /* Forces a nice rectangular shape even if your source images are different sizes */
		border: 1px solid #eaeaea; /* A tiny border just in case the image is mostly white */
	}

	/* The right column for the text */
	.project-info {
		flex: 1; /* Tells the text div to take up all the remaining space */
	}

	/* Overriding your global h2 styles just for these project blocks to make them fit nicer */
	.project-info h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		border-bottom: none;
		padding-bottom: 0;
	}

	/* Responsive Design: Stacks them vertically on small screens */
	@media (max-width: 600px) {
		.project-block {
			flex-direction: column; /* Changes the flex direction from side-by-side to top-to-bottom */
			gap: 1rem;
		}

		.project-thumbnail {
			flex: 1 1 auto; /* Allows the image container to take up the full width */
			width: 100%;
		}
	}
</style>
