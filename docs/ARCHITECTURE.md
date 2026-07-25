# Architecture

How the site is built, why it's arranged this way, and where to make each kind
of change. Read top to bottom and you'll understand the whole system.

If you only want to publish a write-up, you don't need this file — see
**[CONTENT.md](CONTENT.md)** instead.

---

## 1. The big picture

A **SvelteKit** app, **fully prerendered** to static HTML at build time. There
is no server and no database: `npm run build` produces plain files, which is why
the site is fast, cheap to host, and trivially cacheable.

Three principles drive the structure. Most "where does this go?" questions are
answered by one of them.

### Content is data, not code

Write-ups are Markdown files, not Svelte components. Adding one means adding a
file — never a route, never a copied stylesheet, never an entry in a list. The
listing, the URL, the sort order, the category chips, and the social preview are
all _derived_ from what's on disk.

### Declare once, derive everywhere

Anything that could drift out of sync is computed rather than maintained by
hand: categories come from the content, nav links come from the collection
registry, entry URLs come from one `href` field, colours come from one token
file. If you find yourself typing the same value in two places, that's a bug in
the architecture, not a chore.

### Collections are configuration

Projects and the blog are not two features — they're one feature, twice. Adding
a third collection is a registry entry plus three one-line files, not a copy of
the projects directory.

```
        src/content/<collection>/*.md          ← you write these
                      │
                      ▼
        src/lib/content/index.js               ← discovers, sorts, types
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
  CollectionPage.svelte       EntryPage.svelte
  (the listing)               (one write-up)
        │                           │
        ▼                           ▼
  routes/<name>/            routes/<name>/[slug]/
```

---

## 2. Directory map

### Content — what you edit day-to-day

| Path                        | What it is                                                    |
| --------------------------- | ------------------------------------------------------------- |
| `src/content/projects/*.md` | One file per project. Source of truth.                        |
| `src/content/blog/*.md`     | One file per post. Identical format.                          |
| `src/content/goals.md`      | A standalone page's prose (not part of a collection).         |
| `static/<slug>/`            | Images and video for one entry. Folder name matches the slug. |

### The engine — rarely needs changing

| Path                              | What it is                                                                                           |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/lib/content/index.js`        | Discovers every `.md`, builds sorted entry metadata, derives categories, and supplies route loaders. |
| `src/lib/content/collections.js`  | **The registry.** Declares each collection: URL, headings, layout, SEO text.                         |
| `src/lib/content/schema.js`       | JSDoc typedefs for frontmatter, plus the dev-time validation warnings.                               |
| `src/lib/config.js`               | Site-wide config: name, author, canonical URL, nav links, social links.                              |
| `src/lib/physics/balls.svelte.js` | The homepage ball pit simulation.                                                                    |

### Components

| Path                                        | What it is                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| `src/lib/components/CollectionPage.svelte`  | A whole listing page for any collection. Both listings are one line each.  |
| `src/lib/components/EntryPage.svelte`       | A whole write-up page for any collection.                                  |
| `src/lib/components/ArticleLayout.svelte`   | Shared write-up chrome: back-link, title, chips, TOC, and the prose CSS.   |
| `src/lib/components/EntryListCard.svelte`   | Wide stacked card — the `list` listing layout.                             |
| `src/lib/components/EntryGridCard.svelte`   | Fixed-height card — the `grid` listing layout.                             |
| `src/lib/components/Seo.svelte`             | Every page's `<head>`: title, description, canonical, Open Graph, Twitter. |
| `src/lib/components/Nav.svelte`             | Top nav. Links come from config; highlights the current section.           |
| `src/lib/components/Footer.svelte`          | Footer. Its top edge is also the ball pit's floor.                         |
| `src/lib/components/TableOfContents.svelte` | Sticky TOC built from the rendered headings.                               |
| `src/lib/components/CategoryList.svelte`    | Category chips.                                                            |
| `src/lib/components/Figure.svelte`          | Captioned image, with a `Figure N.` label.                                 |
| `src/lib/components/VideoFigure.svelte`     | Captioned looping video, with a `Video N.` label.                          |

### Styling

| Path                        | What it is                                                        |
| --------------------------- | ----------------------------------------------------------------- |
| `src/lib/styles/tokens.css` | **All** colour, spacing, type, radius, shadow, and motion values. |
| `src/app.css`               | Element defaults for Markdown output, plus layout primitives.     |

### Routes

| Path                               | What it is                                                     |
| ---------------------------------- | -------------------------------------------------------------- |
| `src/routes/+layout.svelte`        | App shell: nav, page, footer.                                  |
| `src/routes/+layout.js`            | `export const prerender = true` — makes the whole site static. |
| `src/routes/+page.svelte`          | Homepage: intro copy and the ball pit.                         |
| `src/routes/+error.svelte`         | Styled 404 / error page.                                       |
| `src/routes/<collection>/`         | Listing + `[slug]` pages. Four one-line files per collection.  |
| `src/routes/{about,resume,goals}/` | Standalone pages.                                              |

---

## 3. The content engine

The part worth understanding once.

### Discovery

Vite's `import.meta.glob` requires a **literal** pattern — it's resolved at
build time, not at runtime. So there is exactly one pattern covering every
collection, rather than one glob per collection:

```js
'/src/content/*/*.md';
```

Collections are then discovered from the folder structure. That's why adding a
collection never means editing the engine.

### Why there are two globs

```js
const metaModules = import.meta.glob('/src/content/*/*.md', {
	eager: true,
	import: 'metadata'
});
const componentLoaders = import.meta.glob('/src/content/*/*.md');
```

This pairing is deliberate and is the single most important performance detail
in the codebase:

- **`metaModules`** is eager, but `import: 'metadata'` means the bundler pulls
  in _only the frontmatter object_ from each file. Every compiled article body
  is tree-shaken away. Listing pages therefore ship a few kilobytes of metadata
  rather than every article on the site.
- **`componentLoaders`** is lazy, so each write-up becomes its own chunk that
  loads only when someone visits that page.

Collapsing these into one eager glob is the classic mdsvex trap: it silently
bundles every article into every page that reads the listing. You can verify the
split is intact — after `npm run build`, exactly one client chunk should contain
any given article's prose.

### What an entry looks like

Each file becomes a plain object: its frontmatter, plus `slug`, `collection`, a
derived `href`, and `categories` defaulted to `[]`. Entries are sorted
newest-first by `created`.

`href` is derived in exactly one place. That's what makes a URL scheme change a
one-line edit instead of a search-and-replace across templates.

### Route wiring

`entryRoute(name)` returns both halves a `[slug]/+page.js` needs:

```js
export const { load, entries } = entryRoute('projects');
```

- **`load`** looks up the entry's metadata and lazily imports its component,
  throwing a 404 for an unknown slug.
- **`entries`** tells the prerenderer which URLs exist, so every write-up is
  rendered to static HTML at build time even if nothing links to it yet.

### Validation

`schema.js` warns in **dev only** about missing required fields, unparseable
`created` dates, and a non-array `categories`. Warnings rather than errors is a
deliberate choice: a half-finished draft should still preview. The tradeoff is
that a bad field won't fail CI — if you'd rather it did, throw instead of
`console.warn` in `warnOnInvalidFrontmatter`.

---

## 4. Styling

### Tokens

`src/lib/styles/tokens.css` holds every colour, space, radius, shadow, and
duration as a CSS custom property. Components reference `var(--color-text)`,
never `#333`. Restyling the site is an edit to that one file.

Tokens are named for their **role** (`--color-surface`), not their value
(`--color-white`) — that's what lets the palette change without every name
becoming a lie.

**If you're about to type a raw hex code or a magic pixel value into a
component, add a token instead.**

### Layout primitives

`app.css` defines two wrappers so routes don't reinvent padding:

- `.page` — standard gutter, capped reading measure. Text pages use this.
- `.page-wide` — gutter on all sides. Listing pages use this.

Both read `--page-gutter`, which narrows at the mobile breakpoint. Because nav,
footer, and page bodies all read that same token, their left edges stay aligned
through the breakpoint automatically.

### Styling Markdown

Content is Markdown, so there's nowhere to hang a class on a heading or
paragraph. Two places handle this:

- **`app.css` element selectors** (`h1`, `h2`, `p`, `li`) style Markdown output
  globally.
- **`ArticleLayout.svelte`'s `.post :global(…)` rules** style write-up prose.
  `:global` is required because Svelte's scoping can't see markup it didn't
  compile — the article is slotted in as a snippet.

### One known duplication

CSS cannot use a custom property inside a media query condition, so breakpoint
values (`767px`, `1000px`, `1200px`) are literals in component media queries.
`SCROLL_OFFSET` in `TableOfContents.svelte` likewise mirrors `--nav-height`
because JS can't read a CSS variable without a `getComputedStyle` round-trip.
These are the only intentional value duplications in the codebase.

---

## 5. SEO

`Seo.svelte` renders every page's `<head>` — title, description, canonical URL,
Open Graph, and Twitter card tags. Pages pass a title and description; the
component handles the rest.

Entry pages feed it automatically: `title` from the frontmatter `title`,
`description` from `overview`, and the preview image from `thumbnail`. Which is
why `overview` is worth writing for a stranger skimming search results — it's
not just card copy.

Open Graph requires **absolute** URLs, so `site.url` in `src/lib/config.js` must
be the real production domain. It's currently a placeholder — set it, or link
previews will point at the wrong host. Nothing else depends on it.

---

## 6. The homepage ball pit

The simulation lives in `src/lib/physics/balls.svelte.js`, not in the route, so
the homepage component stays about the homepage. The component only measures the
stage, forwards pointer events, and renders `pit.balls`.

The file is `.svelte.js` rather than `.js` because it uses runes — Svelte only
compiles rune syntax in files with that extension.

`createBallPit()` returns state through getters and exposes a small command
surface (`resize`, `spawn`, `grab`, `drag`, `release`, `start`). State isn't
returned directly, so the component can't mutate it behind the simulation's
back.

### How it works

- **State.** A ball stores only `{ id, x, y, vx, vy }`. Its centre is computed
  as `x + radius`, never stored — that removed a whole class of bugs where a
  cached centre drifted out of sync with the position.
- **Frame-rate independence.** `dt` is measured in 60fps frames and clamped to
  3, so the sim feels identical at 60Hz or 144Hz, and a backgrounded tab can't
  accumulate a huge jump that flings everything off-screen on return.
- **Collisions.** An O(n²) pass separates overlapping pairs and exchanges
  velocity along the contact normal, but only for pairs that are closing in —
  otherwise balls already separating get yanked back together. A held ball
  shoves others without being pushed itself.
- **Throwing.** Drag tracks an exponentially smoothed pointer velocity, so a
  release reflects the gesture's overall direction rather than its last jittery
  millisecond.
- **The floor.** The footer's top edge is the ground. The footer sits in normal
  document flow while the pit is viewport-fixed, so its position in pit
  coordinates changes with scroll — hence re-measuring every frame.
- **Bounds.** `MAX_BALLS` caps the count so the O(n²) pass and the DOM stay
  cheap. Below `MIN_BALL_WIDTH` the pit is disabled entirely: there isn't room
  for it to be fun and dragging fights touch scrolling.

### Tunable constants

All at the top of the module: `GRAVITY`, `BOUNDS_DAMPING`, `COLLISION_DAMPING`,
`BALL_RADIUS`, `MAX_BALLS`, `MAX_THROW`, `MIN_BALL_WIDTH`. Adjust feel without
touching logic.

> **Careful with the grab highlight.** The 1.1 scale is applied inline _inside_
> the same `transform` as the translate. Don't move it to the standalone
> `scale:` CSS property — that applies before `transform`, multiplying the
> translate and shifting the ball off the cursor by ~0.1× its position.

---

## 7. How to make common changes

### Add a project or blog post

See [CONTENT.md](CONTENT.md). One Markdown file.

### Add a whole new collection (e.g. notes)

`projects` and `blog` are both just registry entries wired up this way — a third
collection is the same three steps.

1. Create `src/content/notes/`.
2. Add an entry to `collections` in `src/lib/content/collections.js`:

   ```js
   notes: {
   	name: 'notes',
   	path: '/notes',
   	navLabel: 'Notes',
   	heading: 'Notes',
   	description: 'Short notes and asides.',
   	layout: 'list',
   	empty: 'Nothing published yet.'
   }
   ```

3. Create three files:

   ```svelte
   <!-- routes/notes/+page.svelte -->
   <script>
   	import CollectionPage from '$lib/components/CollectionPage.svelte';
   </script>

   <CollectionPage collection="notes" />
   ```

   ```js
   // routes/notes/[slug]/+page.js
   import { entryRoute } from '$lib/content/index.js';
   export const { load, entries } = entryRoute('notes');
   ```

   ```svelte
   <!-- routes/notes/[slug]/+page.svelte -->
   <script>
   	import EntryPage from '$lib/components/EntryPage.svelte';
   	let { data } = $props();
   </script>

   <EntryPage {data} collection="notes" />
   ```

The listing, sorting, categories, prerendering, SEO, and the **nav link** all
follow. No CSS, no loader, no card component.

### Restyle the site

Edit `src/lib/styles/tokens.css`. Don't touch component styles for colour or
spacing changes.

### Change the nav

Edit `staticLinks` in `src/lib/config.js`. Collection links are appended
automatically — don't add those by hand.

### Change a listing's layout

Flip `layout` between `'list'` and `'grid'` in the registry.

---

## 8. Conventions

- **JavaScript with JSDoc**, not TypeScript. Types live in comments; the Svelte
  language server enforces them in your editor. `schema.js` holds the content
  types.
- **`$lib/…` imports**, never deep relative paths. `$content/…` for standalone
  Markdown pages.
- **Runes only** (`$state`, `$derived`, `$effect`, `$props`) — no `$:`, no
  `export let`, no `on:click`. The Svelte 4 migration is complete.
- **Pointer events**, not mouse events, so interactions work with touch and pen.
- **Comments explain _why_**, not what. If a line looks odd but is correct,
  that's what deserves a comment.

---

## 9. Commands

```sh
npm run dev       # dev server with hot reload
npm run build     # production build; prerenders every page
npm run preview   # serve the production build locally
npm run format    # apply Prettier
npm run lint      # Prettier check + ESLint
```

**`npm run build` is the real correctness check.** Because every page is
prerendered, a broken internal link or bad import fails the build rather than
shipping silently.

### A note on ESLint

`svelte/no-navigation-without-resolve` is **disabled** in `eslint.config.js`. It
exists to keep links working if the app is served from a sub-path, which this
site isn't — it was firing at a dozen link sites and being silenced with
per-line comments, which is worse than one documented decision.

Re-enable it if the site ever moves to a sub-path deployment (a GitHub Pages
project site is the usual case). The content side would be a single edit, since
every entry URL is derived from one `href` field.

---

## 10. Roadmap

The foundation was built with these in mind.

### Search & filtering

Everything needed is already exported from `src/lib/content/index.js`:
`getEntries(name)` for the full list and `getCategories(name)` for
`[{ name, count }]` filter options.

A first version, entirely inside `CollectionPage.svelte`:

1. Hold selected categories in a `$state` array.
2. Render a chip per `getCategories()` entry that toggles selection.
3. Show `entries.filter((e) => selected.every((c) => e.categories.includes(c)))`.
4. For text search, also match `title` and `overview` against an input.

To make filters shareable, store them in the query string (`?category=Optics`)
and read them from `page.url`. Making the chips in `CategoryList.svelte` into
links is the natural way to wire that up — it was kept a separate component for
exactly this.

### Sorting controls

A dropdown re-sorting by `created` vs `updated`. Both timestamps are already in
the data; `updated` is currently collected but unused.

### Per-category styling

If you ever want category colours or icons, add an _optional_ lookup file
mapping a name to display metadata and have `CategoryList` consult it — while
still deriving the _set_ of categories from the content. That keeps "adding a
category" free and only annotates the ones you care about.

### Sitemap & CI

Neither exists yet. A sitemap is a `+server.js` endpoint iterating
`getEntries()` over the registry. CI would be a GitHub Action running
`npm run lint && npm run build` on push.

### Dark mode

Tokens make this tractable: the values are already centralised, so it's a
`@media (prefers-color-scheme: dark)` block overriding the `:root` custom
properties in `tokens.css`. No component would need to change.
