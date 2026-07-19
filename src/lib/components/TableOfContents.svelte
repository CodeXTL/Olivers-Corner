<script>
	// Sticky sidebar TOC for project write-ups. Headings come from Markdown, so the
	// list is built from the rendered DOM rather than from the source file.
	let { container } = $props();

	// Height of the fixed nav bar, plus a little breathing room. Used both for
	// scroll-into-view offsets and for deciding which heading is "current".
	const SCROLL_OFFSET = 96;

	let headings = $state([]);
	let activeId = $state('');

	function slugify(text) {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
	}

	function scrollTo(event, id) {
		event.preventDefault();
		const target = document.getElementById(id);
		if (!target) return;

		const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
		window.scrollTo({ top, behavior: 'smooth' });
		history.replaceState(null, '', `#${id}`);
	}

	// Kept outside `$state` so the scroll handler can read it without making the
	// effect below depend on its own output.
	let elements = [];

	function updateActive() {
		let current = elements[0]?.id ?? '';

		for (const el of elements) {
			if (el.getBoundingClientRect().top > SCROLL_OFFSET + 8) break;
			current = el.id;
		}

		activeId = current;
	}

	// Runs once `container` is bound by the parent, and again if the article changes.
	$effect(() => {
		if (!container) return;

		const found = [...container.querySelectorAll('h2, h3')];
		const used = [];

		for (const el of found) {
			if (!el.id) {
				// mdsvex does not always emit ids, and duplicate titles would collide.
				const base = slugify(el.textContent) || 'section';
				let id = base;
				let n = 2;
				while (used.includes(id)) id = `${base}-${n++}`;
				el.id = id;
			}
			used.push(el.id);
		}

		elements = found;
		headings = found.map((el) => ({
			id: el.id,
			text: el.textContent,
			level: Number(el.tagName[1])
		}));

		updateActive();

		window.addEventListener('scroll', updateActive, { passive: true });
		window.addEventListener('resize', updateActive);

		return () => {
			window.removeEventListener('scroll', updateActive);
			window.removeEventListener('resize', updateActive);
		};
	});
</script>

{#if headings.length > 1}
	<nav class="toc" aria-label="Table of contents">
		<p class="toc-title">On this page</p>
		<ul>
			{#each headings as heading (heading.id)}
				<li class:sub={heading.level === 3}>
					<a
						href="#{heading.id}"
						class:active={activeId === heading.id}
						aria-current={activeId === heading.id ? 'true' : undefined}
						onclick={(e) => scrollTo(e, heading.id)}
					>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.toc {
		position: sticky;
		top: 6rem;
		max-height: calc(100vh - 8rem);
		overflow-y: auto;
		font-size: 0.9rem;
		border-left: 1px solid #eaeaea;
		padding-left: 1rem;
	}

	.toc-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #888;
		margin: 0 0 0.75rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		margin: 0;
		font-size: 0.9rem;
	}

	li.sub {
		padding-left: 0.85rem;
	}

	a {
		display: block;
		padding: 0.35rem 0;
		color: #777;
		text-decoration: none;
		line-height: 1.35;
		border-left: 2px solid transparent;
		margin-left: -1rem;
		padding-left: 1rem;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
	}

	a:hover {
		color: #111;
	}

	a.active {
		color: #111;
		font-weight: 600;
		border-left-color: #111;
	}
</style>
