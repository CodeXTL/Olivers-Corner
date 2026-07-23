# Adding & Editing Content

This is the day-to-day guide: how to publish a project, add a mini, change a
category, drop in images. You don't need to understand the codebase to use it —
if you just want to write, this is the only file you need.

For how the machinery underneath works, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 1. The one-sentence version

**Adding a write-up = adding one Markdown file.** Drop a `.md` file into the
right folder under `src/content/` and its card, its page, its URL, its table of
contents, and its social preview all appear on their own. There is no list to
register it in.

---

## 2. Add a project or a mini

### Step 1 — create the file

| To add a…    | Create                           | It appears at      |
| ------------ | -------------------------------- | ------------------ |
| Project      | `src/content/projects/<slug>.md` | `/projects/<slug>` |
| Mini project | `src/content/minis/<slug>.md`    | `/minis/<slug>`    |

**The filename becomes the URL.** `my-robot.md` → `/projects/my-robot`. Use
lowercase words separated by hyphens; avoid spaces, capitals, and underscores.

### Step 2 — write the frontmatter

Every file starts with a YAML block fenced by `---`. Copy this and edit it:

```yaml
---
title: 'MouseCam: Imaging from an Optical Mouse Sensor'
completion: 'April 2026'
created: '2026-04-30T10:00:00'
updated: '2026-07-16T01:30:00'
categories: ['Embedded Systems', 'Networking', 'Optics']
thumbnail: '/mousecam/Thumbnail.jpg'
overview: 'MouseCam extracts live image data from the optical sensor inside a 20-year-old mouse and streams it wirelessly to a PC.'
---
```

Full field reference is in §5 below.

### Step 3 — add images (optional)

Put them in `static/<slug>/` — a folder named to match the file:

```
static/my-robot/Thumbnail.jpg
static/my-robot/Fig1.jpg
static/my-robot/Vid1.mp4
```

Reference them **without** the `static/` prefix: `/my-robot/Fig1.jpg`.

### Step 4 — write the body

Plain Markdown below the frontmatter. If you want captioned figures, import the
components immediately after the closing `---`:

```svelte
<script>
	import Figure from '$lib/components/Figure.svelte';
	import VideoFigure from '$lib/components/VideoFigure.svelte';
</script>
```

That's it. Run `npm run dev` and the entry is live.

---

## 3. Add a standalone page's prose

Pages like **Career Goals** aren't part of a collection — they're a single
Markdown file rendered by one route. To edit that page's text, edit
`src/content/goals.md`. Nothing else needs to change.

To create a _new_ page like that:

1. Write `src/content/<name>.md` with at least a `title` in its frontmatter.
2. Create `src/routes/<name>/+page.svelte`:

   ```svelte
   <script>
   	import Page, { metadata } from '$content/<name>.md';
   	import Seo from '$lib/components/Seo.svelte';
   </script>

   <Seo title={metadata.title} description="One line for search results." />

   <div class="page">
   	<main>
   		<h1>{metadata.title}</h1>
   		<Page />
   	</main>
   </div>
   ```

3. Add it to `staticLinks` in `src/lib/config.js` so it shows in the nav.

---

## 4. Figures and videos

```svelte
<Figure src="/my-robot/Fig1.jpg" alt="The assembled chassis" n={1} caption="What it shows." />

<VideoFigure src="/my-robot/Vid1.mp4" n={1} caption="What it shows." />
```

- `n` renders the bold **Figure N.** / **Video N.** label. Omit it for an
  unnumbered caption.
- `alt` describes the image for screen readers and for anyone whose image fails
  to load. Write a real description, not "image".
- A caption containing an apostrophe or quotes needs backtick form:
  ``caption={`He said "hi"`}``.

Videos autoplay muted and loop — that's why they need no controls.

---

## 5. Frontmatter reference

| Field        | Required | Type            | What it does                                                                                                          |
| ------------ | -------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `title`      | **Yes**  | string          | Card heading, page `<h1>`, browser tab, and social preview title.                                                     |
| `overview`   | **Yes**  | string          | One-paragraph summary on the card. **Also the meta description**, so write it for a stranger skimming search results. |
| `completion` | **Yes**  | string          | Human-readable "finished when", e.g. `'April 2026'`. Display only.                                                    |
| `created`    | **Yes**  | ISO datetime    | **Sorts the listing, newest first.**                                                                                  |
| `updated`    | No       | ISO datetime    | Last meaningful edit. Not displayed yet — reserved for a future "recently updated" sort.                              |
| `categories` | No       | array of string | Tags. Renders as chips; feeds the category index. Defaults to `[]`.                                                   |
| `thumbnail`  | No       | string          | Card image, by convention `/<slug>/Thumbnail.jpg`. Without one, the card shows a neutral placeholder.                 |

### Notes on the date fields

`completion` is a **display** string for visitors. `created`/`updated` are
**machine** timestamps for sorting. They're separate on purpose, so a page can
read "April 2026" while still sorting precisely.

The time portion is optional — `'2026-04-30'` works — but keeping it lets you
order two things finished the same day.

### If you typo a field

Run `npm run dev` and check the terminal. Missing required fields, unparseable
`created` dates, and a `categories` value that isn't a list each print a warning
naming the file and the field. These are warnings, not errors, so a half-written
draft still previews.

---

## 6. Categories

**There is no central list to edit.** Add the string to any entry's
`categories` array and it exists:

```yaml
categories: ['Embedded Systems', 'Signal Processing'] # ← the new one
```

The site derives the full category set from whatever the content declares, so
categories can never fall out of sync with reality.

Categories are matched as **exact strings**. To reuse an existing one, spell it
identically — `'Optics'` and `'optics'` are two different categories.

---

## 7. Where things live

```
src/content/
├── projects/          ← full write-ups        → /projects/<slug>
│   ├── mousecam.md
│   └── pixshift.md
├── minis/             ← short write-ups       → /minis/<slug>
│   └── example-mini.md
└── goals.md           ← a standalone page     → /goals

static/
├── mousecam/          ← folder name matches the .md filename
│   ├── Thumbnail.jpg
│   ├── Fig1.jpg
│   └── Vid1.mp4
└── pixshift/
```

---

## 8. Publishing

```sh
npm run dev      # preview locally at http://localhost:5173
npm run build    # production build — also catches broken links
```

`npm run build` is worth running before you push. Because every page is
prerendered to static HTML, a broken internal link or a bad component import
**fails the build** rather than shipping silently.

---

## 9. Troubleshooting

**My entry doesn't appear.**
Check the file is directly inside `src/content/projects/` or
`src/content/minis/` (not a sub-folder), and that the extension is `.md`.

**The card shows a striped placeholder instead of my image.**
The `thumbnail` path is wrong or the file isn't there. It must start with `/`
and omit `static/` — `/my-robot/Thumbnail.jpg`, not `static/my-robot/…`.

**Ordering looks wrong.**
Listings sort by `created`, not by `completion`. Check the `created` timestamp
and that it parses — the dev terminal warns if it doesn't.

**My `<Figure>` renders as literal text.**
The `<script>` importing it must come immediately after the closing `---` of
the frontmatter, before any prose.

**A build error mentions a slug I deleted.**
Delete the stale `.svelte-kit` cache: `rm -rf .svelte-kit` and rebuild.
