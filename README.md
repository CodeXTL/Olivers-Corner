# Oliver's Corner

My personal website — technical write-ups, projects, and a ball pit.

Built with [SvelteKit](https://svelte.dev/docs/kit) and
[mdsvex](https://mdsvex.pngwn.io/), fully prerendered to static HTML, deployed
on Vercel.

## Why "Oliver's Corner"?

The full sentimental meaning is "Oliver's corner of the internet", but a shorter
domain works much better for memorability and SEO.

---

## Quick start

```sh
npm install
npm run dev
```

| Command           | What it does                           |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Dev server with hot reload             |
| `npm run build`   | Production build; prerenders all pages |
| `npm run preview` | Serve the production build locally     |
| `npm run format`  | Apply Prettier                         |
| `npm run lint`    | Prettier check + ESLint                |

---

## Documentation

| I want to…                                  | Read                                             |
| ------------------------------------------- | ------------------------------------------------ |
| Publish a project, add an image, fix a typo | **[docs/CONTENT.md](docs/CONTENT.md)**           |
| Understand how the site works, or extend it | **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** |

**The short version:** adding a write-up means adding one Markdown file to
`src/content/projects/` or `src/content/minis/`. Its card, page, URL, table of
contents, and social preview all generate themselves.

---

## Layout

```
src/
├── content/       # Markdown write-ups — the source of truth
├── lib/
│   ├── content/   # the engine: discovery, sorting, route loaders, schema
│   ├── components/
│   ├── physics/   # homepage ball pit simulation
│   ├── styles/    # design tokens
│   └── config.js  # site name, URL, nav, socials
├── routes/        # pages (mostly one-liners over shared components)
└── app.css        # element defaults + layout primitives
static/            # images and video, one folder per write-up
docs/              # architecture + content guides
```

---

## Setup note

`site.url` in [`src/lib/config.js`](src/lib/config.js) is a **placeholder**. Set
it to the real production domain so Open Graph link previews resolve correctly.
Nothing else depends on it.

---

## TODO

- [ ] Set the real production domain in `src/lib/config.js`
- [ ] Add blogpost pages ([how to add a collection](docs/ARCHITECTURE.md#add-a-whole-new-collection-eg-a-blog))
- [ ] Add project search & filtering (foundation in place — see ARCHITECTURE.md §10)
- [ ] Add a sitemap and CI
- [ ] Make homepage cleaner
- [x] Update everything to Svelte 5 syntax (done 07/19/26)
- [x] Make navigation bar links more maintainable (derived from config, done 07/19/26)
- [x] Add design tokens so restyling is one file (done 07/19/26)
- [x] Unify the projects/minis pipelines into one content engine (done 07/19/26)
- [x] Add `src/lib/` components to improve modularity (done 07/16/26)
- [x] Organize `static/` directory contents (done 07/16/26)
- [x] Move project pages to Markdown/mdsvex (done 07/16/26)
- [x] Make `+layout.svelte` cleaner (done 04/10/26)
