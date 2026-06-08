# Rook — Documentation & Showcase Site

The public docs and showcase site for [Rook](https://github.com/bringfire/rook-release),
built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
and styled to match the Rook "folio" aesthetic.

> This folder is **self-contained** and designed to become the root of the public
> Rook repository. The plugin source lives in a separate private repository; this
> site ships only docs, the showcase, and (eventually) release downloads.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321/rook-release/
```

## Build

```sh
npm run build    # outputs static site to ./dist
npm run preview  # preview the production build locally
```

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. Push this folder as the root of the public repo `bringfire/rook-release`.
2. In the repo settings, set **Pages → Build and deployment → Source** to
   **GitHub Actions**.
3. The site publishes to `https://bringfire.github.io/rook-release/`.

### Custom domain (later)

To serve under `docs.bringfiregames.com`:

1. In `astro.config.mjs`, set `base: '/'` and
   `site: 'https://docs.bringfiregames.com'`.
2. Update the `/rook-release/...` links in `src/content/docs/index.mdx` (hero actions) to
   root-relative paths.
3. Add a `CNAME` file in `public/` containing `docs.bringfiregames.com`.
4. Point a DNS CNAME record at `bringfire.github.io`.

## Theme

The folio look (cream paper, brass + oxblood accents, Cormorant / EB Garamond /
JetBrains Mono, double-rule frame) lives in:

- `src/styles/fonts.css` — Google Fonts import
- `src/styles/rook.css` — Starlight CSS-variable overrides + ornaments

Tokens are ported from the Rook deck's design system.

## Structure

```
src/
  content/docs/        Markdown/MDX pages (sidebar defined in astro.config.mjs)
  styles/              Folio theme CSS
  assets/              Logo + imagery (raven)
public/                Static files (favicon, future CNAME)
.github/workflows/     Pages deploy
```
