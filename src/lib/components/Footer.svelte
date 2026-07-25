<script>
	// Site footer. On the homepage its top edge doubles as the ground the balls
	// land on — see `groundLine()` in $lib/physics/balls.svelte.js, which finds this
	// element by its .site-footer class.
	//
	// Links and the author name come from $lib/config.js so contact details are
	// declared once rather than typed into markup.
	import { site, socialLinks } from '$lib/config.js';

	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<p class="credit">&copy; {year} {site.author}</p>

	<div class="footer-links">
		{#each socialLinks as link (link.href)}
			<a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
		{/each}
	</div>
</footer>

<style>
	.site-footer {
		/* Matches the nav bar so the page is bookended by the same colour, and
		   shares the page gutter so its content aligns with everything above. */
		background-color: var(--color-surface-bar);
		padding: var(--space-6) var(--page-gutter);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.credit {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.footer-links {
		display: flex;
		gap: var(--space-6);
	}

	.footer-links a {
		font-size: 0.9rem;
		text-decoration: none;
		color: var(--color-text);
		font-weight: var(--weight-semibold);
	}

	.footer-links a:hover {
		color: var(--color-text-strong);
	}

	@media (max-width: 767px) {
		.site-footer {
			padding: var(--space-5) var(--page-gutter);
		}
	}
</style>
