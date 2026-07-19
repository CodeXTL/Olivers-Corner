<script>
	// Site footer. On the homepage its top edge doubles as the ground the balls
	// land on — see the groundLine() helper in routes/+page.svelte, which finds
	// this element by its .site-footer class.
	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<p class="credit">&copy; {year} Oliver Lee</p>

	<div class="footer-links">
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
		<a href="https://github.com/CodeXTL" target="_blank" rel="noreferrer">GitHub</a>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
		<a href="mailto:xli3086@gatech.edu">Email</a>
	</div>
</footer>

<style>
	.site-footer {
		/* Matches the nav bar so the page is bookended by the same colour. */
		background-color: #eee;
		padding: 1.5rem 10vw;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.credit {
		margin: 0;
		font-size: 0.9rem;
		color: #666;
	}

	.footer-links {
		display: flex;
		gap: 1.5rem;
	}

	.footer-links a {
		font-size: 0.9rem;
		text-decoration: none;
		color: #333;
		font-weight: 600;
	}

	.footer-links a:hover {
		color: #000;
	}

	@media (max-width: 767px) {
		.site-footer {
			padding: 1.25rem 6vw;
		}
	}
</style>
