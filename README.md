# Oliver's Corner

Welcome to the repository containing my personal website "Oliver's Corner"!

## Why Oliver's Corner?

The complete sentimental meaning is "Oliver's corner of the internet", but I figured a shorter domain works much better
for memorability and SEO.

## Architecture

For how the site is structured, how to add a project or category, and where the
foundation is headed next, see **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## TODO:

- [ ] Update everything to Svelte 5 syntax
- [ ] Add blogpost pages
- [ ] Make navigation bar links more maintainable
- [ ] Make homepage cleaner
- [ ] Add project search & filtering (foundation in place — see ARCHITECTURE.md §6)
- [x] Add `src/lib/` components to improve modularity (done 07/16/26)
- [x] Organize `static/` directory contents (renamed per-project folders, done 07/16/26)
- [x] Improve project page structure by removing hardcoded components (moved to Markdown/mdsvex, done 07/16/26)
- [x] Make `+layout.svelte` cleaner (done 04/10/26)
  - [x] Create `app.css` global stylesheet (done 04/10/26)
  - [x] Create `Nav.svelte` component (done 04/10/26)

<!-- # sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.12.7 create --template demo --no-types --add prettier eslint --install npm .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment. -->
