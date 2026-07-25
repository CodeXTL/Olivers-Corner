# Styling

How CSS is organized on this site and where to make each kind of change. If you
want to change a colour, adjust spacing, or restyle prose, this is the file to
read.

For how the site is built overall, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 1. The one-sentence version

**Global styles live in small partials split by job; each component styles
itself.** There are only two questions to ask: _is this a site-wide rule or a
component's own?_ — and if site-wide, _which of the four partials owns it?_

---

## 2. Where styles live

```
src/app.css                  ← the manifest: imports the partials below, in order
src/lib/styles/
├── tokens.css               ← design values: colour, space, type, radius, shadow, motion
├── base.css                 ← reset + document defaults: box model, body, focus ring, media
├── typography.css           ← all text styling: element defaults + article prose
└── layout.css               ← page wrappers: .page, .page-wide

src/lib/components/*.svelte   ← each component's own styles, in its <style> block
```

Each partial has one responsibility, so there's an obvious place to look:

| I want to change…                              | Edit                |
| ---------------------------------------------- | ------------------- |
| A colour, spacing step, font size, shadow…     | `tokens.css`        |
| The page background, body font, focus outline  | `base.css`          |
| How headings / paragraphs / article prose read | `typography.css`    |
| Page padding, reading width, the nav clearance | `layout.css`        |
| One component's appearance                     | that `.svelte` file |

**`app.css` holds no rules of its own** — it's just the ordered import list. You
rarely touch it; only when adding or removing a whole partial.

---

## 3. How precedence works

CSS resolves conflicts by _cascade order_ and _specificity_. Two rules here keep
that predictable, so you almost never have to fight it:

1. **Import order is cascade order.** In `app.css` the sequence is `tokens →
base → typography → layout`. When two global rules of equal specificity
   collide, the one in the later file wins. Tokens load first because everything
   references them; they define no rules themselves, only values.

2. **Component styles always win over globals.** Svelte scopes each component's
   `<style>` to that component, and those rules take precedence over the global
   partials. That's what lets a component override a base rule when it genuinely
   needs to — and why you should keep component-specific styling _in_ the
   component rather than piling exceptions into the global files.

Within `typography.css` the same idea plays out in miniature: the bare element
rules come first, then the `.post` rules, which win for write-up bodies both by
coming later and by being more specific.

---

## 4. Common changes, step by step

### Change a colour (or the whole palette)

Edit the value in `tokens.css`. Because components reference the token by role
(`var(--color-text)`), the change flows everywhere that colour is used.

```css
--color-text: #333; /* body copy → change here, updates site-wide */
```

Tokens are named for their **role** (`--color-surface`), not their look
(`--color-white`). Keep it that way: if you rename, rename the role, so the name
never becomes a lie after a palette change.

### Add a new token

Add it to the matching group in `tokens.css`, then use `var(--name)` in your
rule. **Never type a raw hex or a magic pixel value into a component** — add a
token first. Even a colour used by a single component (the About-page paintbrush,
the homepage ball's grab shade) lives in `tokens.css`, so every colour is
changed in exactly one place.

### Restyle body text or article prose

All of it is in `typography.css`, in two tiers:

- **Element defaults** (`h1`, `h2`, `p`, `li`, `code`) style _every_ heading and
  paragraph on the site — Markdown output and headings that routes write by hand
  alike. Change these to affect everything.
- **`.post` rules** add the fuller treatment used only in write-up bodies
  (heavier heading rule, relaxed line length, list indentation, inline-code
  chips). Change these to affect articles without touching the rest of the site.

There is no third place to look: prose styling is not split across the component
files.

### Give another page the full article treatment

Standalone Markdown pages (e.g. Career Goals) get the element defaults but not
the `.post` layer. To opt one in, wrap its content in a `.post` container:

```svelte
<div class="page">
	<main class="post">
		<h1>{metadata.title}</h1>
		<Goals />
	</main>
</div>
```

No new CSS — it inherits the same `.post` rules articles use.

### Adjust page spacing or reading width

Layout wrappers are in `layout.css`. `.page` (text pages) and `.page-wide`
(listing pages) both read `--page-gutter` for their inset and floor their top
padding at `--nav-height` so a heading never hides behind the fixed nav on narrow
screens. To change the overall gutter or reading measure, edit the token
(`--page-gutter`, `--measure-prose`) rather than the wrapper.

### Style a component

Put the rules in that component's own `<style>` block and reference tokens for
any value. Don't add a component's one-off styling to the global partials — the
whole point of the split is that global files stay small and predictable.

### Add a responsive rule

Use a `@media` query. Note that **breakpoint values are literals**, not tokens
(`767px`, `1000px`, `1200px`) — CSS can't use a custom property inside a media
query _condition_. Match the existing breakpoints so the site steps at the same
widths. See §5.

---

## 5. Conventions and known duplications

- **Role-named tokens, no raw hex in components.** `tokens.css` is the single
  source of colour, spacing, and type. A raw `#abc` or `12px` in a `.svelte`
  file is a missing token.
- **Component styles stay in components.** Global partials own only genuinely
  site-wide rules.
- **One focus style, site-wide.** The `:focus-visible` ring is defined once in
  `base.css`. Don't redefine it per component unless the shape genuinely differs.
- **Motion respects `prefers-reduced-motion`.** Durations are zeroed in a media
  query in `tokens.css`; animate via the duration tokens so this applies for
  free.
- **Two intentional value duplications, by necessity, not neglect:**
  - Breakpoint literals in `@media` conditions — CSS can't read a custom
    property there.
  - `SCROLL_OFFSET` in `TableOfContents.svelte` mirrors `--nav-height` — JS
    can't read a CSS variable without a `getComputedStyle` round-trip.

---

## 6. Checking your work

```sh
npm run format   # apply Prettier (includes CSS)
npm run lint     # Prettier check + ESLint
npm run build    # prerender everything; a broken import fails the build
```

There's no visual test suite, so preview with `npm run dev` and check the change
in the browser — including at a narrow width, where the nav clearance and the
gutter breakpoint matter most.
