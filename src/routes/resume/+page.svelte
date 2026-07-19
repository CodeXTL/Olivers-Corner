<script>
	import Seo from '$lib/components/Seo.svelte';

	// The PDF is referenced twice (viewer + download), so its path lives in one
	// constant — swapping in a newer resume is a single edit.
	const RESUME_PDF = '/Lee_Oliver_Resume_Jul26.pdf';
</script>

<Seo
	title="Resume"
	description="Oliver Lee's resume — Computer Science graduate pursuing a second Bachelor's in Electrical Engineering at Georgia Tech."
/>

<div class="page">
	<main>
		<h1>Resume</h1>

		<p>You can view my resume below, or download a PDF version for your convenience.</p>

		<a href={RESUME_PDF} download="Oliver_Lee_Resume.pdf" class="download-btn">
			Download PDF Resume
		</a>
	</main>
</div>

<div class="pdf-container">
	<object
		data={RESUME_PDF}
		type="application/pdf"
		width="100%"
		height="800px"
		aria-label="Oliver Lee's Resume PDF"
	>
		<p>
			It appears your web browser doesn't support embedded PDFs.
			<a href={RESUME_PDF}>Click here to view it.</a>
		</p>
	</object>
</div>

<style>
	.download-btn {
		display: inline-block;
		padding: 0.6rem var(--space-5);
		background-color: var(--color-text-heading);
		color: var(--color-surface);
		text-decoration: none;
		border-radius: var(--radius-sm);
		font-weight: var(--weight-semibold);
		font-size: 0.9rem;
		margin-bottom: var(--space-8);
		transition:
			background-color var(--duration-base) var(--ease),
			transform 0.1s var(--ease);
	}

	.download-btn:hover {
		background-color: var(--color-text);
		color: var(--color-surface);
	}

	.download-btn:active {
		transform: scale(0.98); /* Little click animation */
	}

	.pdf-container {
		margin: calc(var(--space-8) * -1) var(--page-gutter) var(--space-16);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}
</style>
