<svelte:head>
	<title>Resume | Oliver's Corner</title>
</svelte:head>

<div class="page-wrapper">
	<main>
		<h1>Resume</h1>

		<p>You can view my resume below, or download a PDF version for your convenience.</p>

		<a href="/Lee-Oliver_Resume.pdf" download="Oliver_Lee_Resume.pdf" class="download-btn"
			>Download PDF Resume</a
		>
	</main>
</div>

<div class="pdf-container">
	<object data="/Lee-Oliver_Resume.pdf" type="application/pdf" width="100%" height="800px" aria-label="Oliver Lee's Resume PDF">
		<p>
			It appears your web browser doesn't support embedded PDFs. <a href="/resume.pdf"
				>Click here to view it.</a
			>
		</p>
	</object>
</div>

<style>
	.download-btn {
		display: inline-block;
		padding: 0.6rem 1.2rem;
		background-color: #111;
		color: #fff;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 600;
		font-size: 0.9rem;
		margin-bottom: 2rem;
		transition:
			background-color 0.2s ease,
			transform 0.1s ease;
	}

	.download-btn:hover {
		background-color: #333;
		color: #fff;
	}

	.download-btn:active {
		transform: scale(0.98); /* Little click animation */
	}

	.pdf-container {
		margin: -2rem 10vw 4rem 10vw; 
		border: 1px solid #eaeaea;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}
</style>
