# Architecture & Content System

This document explains how the site is structured after the projects-section
refactor, how to do common tasks (add a project, add a category), and where to
go next. It's written to be a learning reference — if you read it top to bottom
you'll understand the whole content pipeline.

---

## 1. The big picture

The site is a **SvelteKit** app that is **fully prerendered** to static HTML at
build time (so it can be hosted as plain files and is fast + SEO-friendly).

The key idea of the refactor: **project write-ups are content (Markdown), not
code.** Each project lives in one Markdown file with a metadata header
("frontmatter"). Everything else — the listing page, the per-project page, the
ordering, the category chips — is generated automatically from those files.

**Adding a project = adding one `.md` file.** No new routes, no copied CSS.

```
                    src/content/projects/*.md   ← you write these
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
   src/lib/projects.js                 routes/projects/[slug]/
   (reads all frontmatter)             (renders one project by its filename)
              │                               │
              ▼                               ▼
   routes/projects/+page.svelte        ProjectLayout + <Content/>
   (the listing, auto-built)           (the write-up, styled)
```

---

## 2. Directory map (what each file does)

### Content — the part you edit day-to-day

| Path                        | What it is                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/content/projects/*.md` | **One file per project.** Frontmatter (metadata) at the top, the write-up in Markdown below. This is the source of truth. |

### Library — the engine (rarely needs changing)

| Path                                      | What it is                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/projects.js`                     | Reads every `*.md` frontmatter via Vite's `import.meta.glob`, exports the sorted `projects` array and the derived `categories` list. |
| `src/lib/components/ProjectCard.svelte`   | One entry on the `/projects` listing (thumbnail + title + overview + category chips).                                                |
| `src/lib/components/ProjectLayout.svelte` | The shared "chrome" wrapped around every write-up: back-link, title, category chips, and the CSS that styles the Markdown prose.     |
| `src/lib/components/Figure.svelte`        | A captioned image. Renders the `Figure N.` label.                                                                                    |
| `src/lib/components/VideoFigure.svelte`   | A captioned autoplaying video. Renders the `Video N.` label.                                                                         |
| `src/lib/components/CategoryList.svelte`  | Renders an array of categories as chips. Used by both the card and the layout.                                                       |
| `src/lib/components/Nav.svelte`           | The top navigation bar (unchanged by the refactor).                                                                                  |

### Routes — the pages

| Path                                      | What it is                                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/routes/+layout.svelte`               | App shell: renders `<Nav>` then the page.                                                                   |
| `src/routes/+layout.js`                   | `export const prerender = true` — makes the **whole site** static.                                          |
| `src/routes/projects/+page.svelte`        | The listing. Loops over `projects` and renders a `ProjectCard` for each.                                    |
| `src/routes/projects/[slug]/+page.js`     | Loads the right `.md` file based on the URL slug. Also lists all slugs for the prerenderer via `entries()`. |
| `src/routes/projects/[slug]/+page.svelte` | Renders the loaded write-up inside `ProjectLayout`.                                                         |

### Static assets

| Path                                   | What it is                                                                                                                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `static/pixshift/`, `static/mousecam/` | Images/videos for each project. Folder name matches the project slug by convention. Referenced in Markdown as `/pixshift/Fig1.jpg` (the `static/` prefix is dropped in URLs). |

### Config

| Path               | What changed                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `svelte.config.js` | Added the **mdsvex** preprocessor and registered `.md` as a component extension, so Markdown files compile to Svelte components. |

---

## 3. How rendering actually works (the data flow)

Worth understanding once, so nothing feels like magic.

**The listing page** (`/projects`):

1. `src/lib/projects.js` runs `import.meta.glob('/src/content/projects/*.md', { eager: true })`. At build time Vite finds every matching file and imports it.
2. Because mdsvex compiled each `.md`, each import exposes a `metadata` object (the frontmatter) and a `default` export (the rendered component).
3. `projects.js` maps those into plain objects `{ slug, title, categories, created, … }`, sorts them, and exports the array.
4. `+page.svelte` imports that array and renders a `ProjectCard` per entry.

**A single project page** (e.g. `/projects/mousecam`):

1. The `[slug]` route matches; `params.slug` is `"mousecam"`.
2. `[slug]/+page.js`'s `load()` does `import('../../../content/projects/mousecam.md')` and returns `{ content, meta }`.
3. `[slug]/+page.svelte` renders `<ProjectLayout meta={data.meta}><Content /></ProjectLayout>`, where `Content` is the compiled Markdown.
4. `ProjectLayout` draws the back-link, title, and category chips, and its scoped CSS styles the headings/paragraphs/lists/code that the Markdown produced.

**Why `entries()` exists:** prerendering needs to know every URL to visit. `entries()` in `+page.js` lists all slugs so the build renders `/projects/pixshift`, `/projects/mousecam`, etc. even if a link were missing.

---

## 4. Frontmatter reference (the metadata schema)

Every project `.md` starts with a YAML block between `---` fences:

```yaml
---
title: 'MouseCam: Imaging from an Optical Mouse Sensor'
completion: 'April 2026'
created: '2026-04-30T10:00:00'
updated: '2026-07-16T01:30:00'
categories: ['Embedded Systems', 'Hardware', 'Networking', 'Optics']
thumbnail: '/mousecam/Thumbnail.jpg'
overview: 'MouseCam is a project with the goal of extracting live image data...'
---
```

| Field        | Type                | Purpose                                                                                    |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------ |
| `title`      | string              | Shown on the card, the page `<h1>`, and the browser tab.                                   |
| `completion` | string              | Human-readable "when it was finished", shown on the card. Free text.                       |
| `created`    | ISO datetime string | When the project began. **Used to sort the listing (newest first).**                       |
| `updated`    | ISO datetime string | Last meaningful edit. Not shown yet — reserved for a future "recently updated" sort/label. |
| `categories` | string array        | Tags for the project. Drives the chips and the future filter. Add new ones freely.         |
| `thumbnail`  | string (URL path)   | Card image. By convention `/{slug}/Thumbnail.jpg`.                                         |
| `overview`   | string              | One-paragraph summary on the card.                                                         |

**Dates:** the `T…` time portion is optional but recommended (`'2025-12-15'`
works too). Keeping the time lets you order projects finished on the same day.

**`completion` vs `created`/`updated`:** `completion` is a _display_ string for
visitors; `created`/`updated` are _machine_ timestamps for sorting. They're kept
separate on purpose so you can, e.g., show "April 2026" while still sorting
precisely. If you'd rather derive the displayed date from `updated`, that's a
small change in `ProjectCard.svelte`.

---

## 5. How-to guides

### Add a new project

1. Create `src/content/projects/<slug>.md`. The filename **is** the URL: `my-robot.md` → `/projects/my-robot`.
2. Add frontmatter (copy an existing file's block and edit it — see §4).
3. If you want images/videos, drop them in `static/<slug>/` and reference them as `/<slug>/Fig1.jpg`.
4. Write the body in Markdown. To import the figure components, start the file (right after the frontmatter) with:
   ```svelte
   <script>
   	import Figure from '$lib/components/Figure.svelte';
   	import VideoFigure from '$lib/components/VideoFigure.svelte';
   </script>
   ```
5. That's it. The card and page appear automatically, ordered by `created`.

### Use images and videos

```svelte
<Figure src="/myslug/Fig1.jpg" alt="Alt text" n={1} caption="What it shows." />

<VideoFigure src="/myslug/Vid1.mp4" n={1} caption="What it shows." />
```

- `n` is the figure/video number and renders the bold "Figure N." / "Video N." label. Omit it for an unnumbered caption.
- A caption containing quotes needs the `{`...`}` form: `caption={`He said "hi"`}`.

### Write the prose

Just normal Markdown: `## Heading`, paragraphs, `- bullet lists`, `1. numbered
lists`, `**bold**`, and `` `inline code` ``. The styling for all of these lives
in `ProjectLayout.svelte` under the `.post :global(...)` rules, so every project
looks consistent.

### Add a category

There is **no central list to edit** — just add the string to any project's
`categories` array:

```yaml
categories: ['Embedded Systems', 'Signal Processing'] # ← new one
```

The master list in `src/lib/projects.js` (the `categories` export) is derived
automatically: it's the deduplicated, alphabetically-sorted union of every
project's categories, each with a count of how many projects use it. Use the
exact same spelling to reuse a category (they're matched by string).

---

## 6. Where to go from here (roadmap)

The foundation was built with these next steps in mind.

### Search & filtering (the main goal)

Everything you need is already exported from `src/lib/projects.js`:

- `projects` — the full list, each with a `categories` array.
- `categories` — `[{ name, count }, …]` for building filter controls.

A minimal first version, all inside `routes/projects/+page.svelte`:

1. Import `{ projects, categories }`.
2. Hold selected categories in a `$state` variable.
3. Render a chip/checkbox per `categories` entry that toggles selection.
4. Show `projects.filter(p => selected.every(c => p.categories.includes(c)))`.
5. For a text search, also match `title`/`overview` against an input's value.

To make it shareable/bookmarkable, store the active filters in the URL query
string (`?category=Optics`) and read them with SvelteKit's `page` store. Making
the chips in `CategoryList.svelte` into `<a href>` links is the natural way to
wire that up — the component was kept separate for exactly this.

### Sorting controls

Add a dropdown that re-sorts `projects` by `created` vs `updated`, ascending or
descending. The timestamps are already in the data.

### A blog / other content types

The same pattern generalizes. Create `src/content/posts/*.md`, a
`routes/blog/[slug]` route, and a `posts.js` loader mirroring `projects.js`. The
`Figure`/`VideoFigure` components and the prose CSS can be reused. (See the
README TODO — "Add blogpost pages".)

### Nicer categories (optional)

If you ever want per-category colors, descriptions, or icons, add an _optional_
registry file (e.g. `src/lib/categories.js`) mapping a category name to its
display metadata, and have `CategoryList` look it up — while still deriving the
_set_ of categories from the projects. That keeps "adding a category" as easy as
it is now, and only annotates the ones you care to style.

---

## 7. Commands

```sh
npm run dev       # local dev server with hot reload
npm run build     # production build (also prerenders every page)
npm run preview   # serve the production build locally
npm run format    # apply Prettier
npm run lint      # Prettier check + ESLint
```

**Tip:** `npm run build` is a good correctness check — because the whole site is
prerendered, a broken internal link or a bad import fails the build instead of
silently shipping.

---

## 8. Homepage physics (the ball mechanic)

The home page (`src/routes/+page.svelte`) has a little toy: bouncing balls you
can drop, drag, and fling. It was rewritten to be faster, smoother, and modern.
Everything lives in that one file.

### How it works now

- **State (Svelte 5 runes).** `balls` is a `$state` array; each ball stores only
  `{ id, x, y, vx, vy }` (position + velocity). The center is always `x/y +
radius`, so it's computed, not stored — that removed a whole class of
  "center out of sync with position" bugs.
- **One animation loop.** A single `$effect` starts a `requestAnimationFrame`
  loop and cancels it on cleanup. Each frame runs `step(dt)`: resolve
  collisions, then apply gravity + movement + wall bounces to every ball that
  isn't being held.
- **Frame-rate independence.** `dt` is the time since the last frame measured in
  "60fps frames" and clamped to 3. So the sim feels identical on a 60Hz or
  144Hz display, and a backgrounded tab can't build up a huge time jump and
  fling everything off-screen when you return.
- **Collisions.** `resolveCollisions()` is an O(n²) pass over ball pairs: it
  separates overlapping balls and exchanges velocity along the line between
  their centers (scaled by `COLLISION_DAMPING`). A held ball shoves others but
  isn't pushed itself.
- **Drag + throw.** Pressing a ball sets `draggingId`; pointer moves reposition
  it and track a smoothed pointer velocity; releasing converts that velocity
  (clamped to `MAX_THROW`) into the ball's `vx/vy` — so you can fling it.
- **Spawning.** Pressing empty background adds a ball at the cursor. `spawn`
  only fires when the press target is the background itself (not the text or a
  ball). `MAX_BALLS` caps the count (oldest is dropped) to keep collisions and
  the DOM cheap.

### The tunable knobs

All at the top of the `<script>`, so you can adjust feel without touching logic:

| Constant            | Effect                                                                        |
| ------------------- | ----------------------------------------------------------------------------- |
| `GRAVITY`           | How fast balls accelerate downward.                                           |
| `BOUNDS_DAMPING`    | Energy kept on a wall bounce (1 = perfectly bouncy).                          |
| `COLLISION_DAMPING` | Energy kept in a ball-to-ball hit.                                            |
| `BALL_RADIUS`       | Ball size. Also update `width`/`height` in `.ball` CSS to match the diameter. |
| `MAX_BALLS`         | Cap on how many balls exist at once.                                          |
| `MAX_THROW`         | Speed limit when flinging a ball on release.                                  |

### What changed from the old version (and why)

| Before                                | After                                       | Why                                                                                    |
| ------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| `left` / `top` inline styles          | `transform: translate(...)` + `will-change` | `transform` is GPU-composited and skips layout every frame — the main performance win. |
| `balls = balls` after every mutation  | `$state` deep reactivity                    | Idiomatic Svelte 5; no manual re-assignment, fewer footguns.                           |
| `requestAnimationFrame` with no delta | clamped delta-time `step(dt)`               | Consistent speed across monitor refresh rates.                                         |
| Mouse events only (`on:mousedown` …)  | Pointer events (`onpointerdown` …)          | Now works on touchscreens/pens, not just a mouse.                                      |
| Released balls dropped straight down  | Throw velocity from drag                    | Feels like actually throwing them.                                                     |
| Unbounded ball count                  | `MAX_BALLS` cap                             | Bounds the O(n²) collision cost and DOM size.                                          |
| Stored `x_center` / `y_center`        | Computed from `x`/`y`                       | Eliminated position/center desync bugs.                                                |
| Unkeyed `{#each balls}`               | Keyed by `ball.id`                          | Correct DOM reuse, no unnecessary churn.                                               |

> Note on the drag highlight: the ball's position uses the inline `transform`,
> so the "grow while grabbing" effect appends `scale(1.1)` **inside that same
> `transform`** (`translate(...) scale(1.1)`). Don't use the standalone `scale:`
> CSS property for this — it's applied before `transform`, which multiplies the
> translate and shifts the ball off the cursor by ~0.1× its position.

### Possible next steps

- Respect `prefers-reduced-motion` (e.g. don't auto-run gravity) for
  accessibility.
- Spatial partitioning (a grid) if you ever raise `MAX_BALLS` a lot — turns the
  O(n²) collision check into roughly O(n).
