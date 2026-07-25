---
title: 'Example Post'
completion: 'July 2026'
created: '2026-07-19T12:00:00'
updated: '2026-07-19T12:00:00'
categories: ['Example']
# Drop an image at static/<slug>/Thumbnail.jpg and uncomment to use it. Without
# a thumbnail the card shows a neutral placeholder in the same 40% slot.
# thumbnail: '/example-post/Thumbnail.jpg'
overview: 'A placeholder blog post showing the frontmatter and layout. Delete this file once you have a real one — the /blog page builds itself from whatever is in src/content/blog.'
---

## Overview

This is a placeholder so the `/blog` route has something to render. A post works
exactly like a project write-up: same Markdown, same components, same styling —
so a deep dive, a breakdown of part of a project, or a "here's something cool"
explainer all have a home here.

## Adding a real post

1. Create `src/content/blog/<slug>.md` — the filename becomes the URL.
2. Fill in the frontmatter (`title`, `completion`, `created`, `overview`, and
   optionally `thumbnail` and `categories`).
3. Put any images in `static/<slug>/` and reference them as `/<slug>/Fig1.jpg`.

The card and the page appear automatically, ordered newest-first by `created`.

## Figures work too

Import the figure components right after the frontmatter and use them exactly as
the full project write-ups do — the prose styling is shared, so headings, lists,
and `inline code` all match.
