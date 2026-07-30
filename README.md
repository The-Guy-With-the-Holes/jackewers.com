<div align="center">

# JackEwers.com — Personal Portfolio & Digital Business Card

[![Live Website](https://img.shields.io/badge/Live_Website-jackewers.com-blue?style=for-the-badge)](https://jackewers.com)
[![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-success?style=for-the-badge&logo=github)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

**Personal portfolio and digital business card for Jack Ewers — projects, certifications, and a link-in-bio hub.**

</div>

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [External Resources](#external-resources)
- [Pages & Sections](#pages--sections)
- [Design System](#design-system)
- [SEO](#seo)
- [Deployment](#deployment)
- [Versioning](#versioning)
- [Development Workflow](#development-workflow)
- [License](#license)

## Overview

**JackEwers.com** is a static personal site hosted on GitHub Pages behind the custom domain `jackewers.com` (see [`CNAME`](CNAME)). It's plain HTML/CSS/JS — no build step, no framework, no server-side rendering in production.

## Project Structure

```
jackewers/
├── index.html                  # Landing page
├── CNAME                       # Custom domain for GitHub Pages
├── robots.txt                  # Crawler rules
├── favicon.ico
├── home.css                    # Landing page styles
├── KeyFunctions.js             # Root-level DOM/date/scroll utility library
├── version.json                # Version + changelog data
├── VersionManager.php          # Local CLI helper for editing version.json (not served/deployed)
├── portfolio-albums.json       # Data for the JS/portfolio-albums.js loader
├── codenames.json              # Release codename pool used by VersionManager.php
├── eslint.config.js            # Correctness-only lint rules (run in CI)
├── serve.sh                    # Local dev server (serves this dir as the doc root)
│
├── about/                      # About page + body modification history
│   └── body-mod/
├── albums/                     # Photo albums (JSON-driven galleries)
├── app/                        # Projects hub
│   ├── projects/                 # Individual project pages (am-i-old-yet, doorbell,
│   │                              #   be-my-valentine, S.P.I.N, P.W.M, smarthome, router,
│   │                              #   qr, image-crop, games/…)
│   ├── 100-days-of-code/
│   ├── calculator/
│   ├── js/                       # JS playground
│   └── scripts/
├── certificates/                # Certifications gallery
├── contact/
├── recommendations/             # People/business recommendations
├── mental-health/                # Mental health resources page
├── mods/                        # Legacy URL, meta-refreshes to /about/body-mod/
├── linktree/                    # @the_guy_with_the_holes link-in-bio page
├── email-signatures/            # HTML email signature templates (gitignored)
├── JS/                          # Root-level shared scripts (portfolio-albums.js, projects.js)
└── shared/assets/               # Cross-page shared code
    ├── components/                # navbar.html (fetched at runtime)
    ├── scripts/                    # early-theme.js, theme.js, load-navbar.js
    └── styles/                     # design-system.css, vars.css, nav.css, ...
```

## Technologies Used

- **HTML5 / CSS3 / vanilla JavaScript** — no framework, no bundler, no `package.json`.
- **CSS Custom Properties** for theming (`shared/assets/styles/vars.css`), with light/dark mode via `data-theme`.
- **PHP** — used only by `VersionManager.php`, a local CLI helper for maintaining `version.json`. It is not deployed or executed in production (GitHub Pages doesn't run PHP).
- **Web APIs used in specific projects**: `getUserMedia`/Canvas (photo capture apps under `app/projects/`), Web Share API, Intersection Observer for lazy loading.

## External Resources

| Service | Purpose | Notes |
|---------|---------|-------|
| Google Fonts | Typography | Preconnected for performance |
| Font Awesome (cdnjs) | Icons | Loaded via CDN `<link>` |
| `bloodweb.net` / `media.bloodweb.net` | Shared branding assets, images, `KeyFunctions.js` mirror | Jack's own studio, see structured data on the homepage |
| Schema.org JSON-LD | Structured data linking the Person (Jack Ewers) to the Bloodweb Organization | On `index.html`, `/about/`, `/contact/`, `/certificates/` |
| GitHub Pages | Static hosting for the custom domain | No custom HTTP headers available — security headers are set via `<meta>` tags instead of an `.htaccess`/server config |

## Pages & Sections

| Path | Purpose |
|------|---------|
| `/` | Landing page — hero, project highlights, contact |
| `/about/` | About page |
| `/about/body-mod/` | Body modification history/timeline |
| `/app/` | Projects hub (`/app/projects/*`) |
| `/certificates/` | Certifications gallery |
| `/contact/` | Contact page |
| `/recommendations/` | People/business recommendations |
| `/mental-health/` | Mental health resources |
| `/albums/` | Photo albums |
| `/linktree/` | Link-in-bio page |
| `/mods/` | Legacy redirect → `/about/body-mod/` |

## Design System

Design tokens (fonts, spacing, colors, breakpoints) live in `shared/assets/styles/vars.css` and `design-system.css` — read those directly rather than relying on this doc, since they change independently of it.

## SEO

- `robots.txt` at the repo root controls crawling.
- `sitemap.xml` at the repo root lists indexable pages (see [Versioning](#versioning) for how it's kept current — update it when adding/removing top-level pages).
- Open Graph tags and JSON-LD structured data are set per-page.

## Deployment

- **Host**: GitHub Pages, custom domain via [`CNAME`](CNAME).
- **`.nojekyll`**: present at the repo root so GitHub Pages serves files/folders as-is without Jekyll processing.
- Pushing to `main` deploys directly — there is no build step.
- `.htaccess` in this repo is for **local Apache development only** (it's gitignored); GitHub Pages ignores it entirely and sets no custom HTTP headers, which is why security policy is delivered via `<meta http-equiv>` tags instead.

## Versioning

`version.json` holds the version number, build number, and a per-build changelog, edited locally via `VersionManager.php`. `codenames.json` is the pool of release codenames it draws from. See [`CHANGELOG.md`](CHANGELOG.md) for the human-readable log.

## Development Workflow

There's no build step — edit the HTML/CSS/JS directly.

### Running it locally

Every link on the site is root-relative (`/about`, `/shared/assets/...`), which
is what GitHub Pages needs when serving at a domain root. **Opening the folder
as a subdirectory will break every link** — reaching it at
`192.168.1.107/jackewers/` makes `/about` resolve to `192.168.1.107/about`,
which 404s. A `<base href>` does *not* help: per the URL spec, root-relative
paths discard the base's path entirely, so only genuinely relative hrefs are
affected.

So serve the project directory *as the document root*:

```bash
./serve.sh          # defaults to port 8080
./serve.sh 9000     # or pick a port
```

Then browse `http://<your-ip>:8080/` — links resolve exactly as they do in
production. The script is a thin wrapper around `python3 -m http.server`, so
there's nothing to install and no Apache config to change.

CI (`.github/workflows/site-checks.yml`) runs on every push to `main`: HTML5
validation, an ESLint correctness pass (`no-undef` and friends — no style
rules), a broken-link check, and a structural check for dead-end pages and
unreferenced assets. To run the linter locally:

```bash
npm install --no-save eslint@9 globals && npx eslint .
```

Commit messages follow plain, descriptive style (see `git log`), not a fixed prefix scheme.

## License

MIT — see [`LICENSE`](LICENSE).

---

<div align="center">

**Jack Ewers** — [jackewers.com](https://jackewers.com) · [GitHub](https://github.com/The-Guy-With-the-Holes)

</div>
