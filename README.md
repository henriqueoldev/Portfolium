# Portfolium

Portfolio and resume for developers. Astro 5, Tailwind CSS 4, GSAP, Netlify adapter.

All content is file-based: profile and links in `src/config/UserData.json`, resume in
`src/config/UserResume.md`, one Markdown file per project in `src/config/content/`.
Application code lives in `src/lib` (behavior) and `src/components` (markup).

If you are an AI agent configuring this project, read [`AGENTS.md`](./AGENTS.md).

## Requirements

- Node.js >= 20
- npm

## Getting started

```bash
npm install
npm run dev     # http://localhost:4321
```

Copy `.env.example` to `.env` only if you want the optional GitHub token.

## Routes

| Route        | Source                                               |
| :----------- | :--------------------------------------------------- |
| `/`          | `src/pages/index.astro` — profile, projects, GitHub  |
| `/<project>` | `src/pages/[...id].astro` — from `content/<slug>.md` |
| `/resume`    | `src/pages/resume.astro` — `src/config/UserResume.md` |

## Configuration

### Profile — `src/config/UserData.json`

| Key              | Type   | Notes                                                      |
| :--------------- | :----- | :--------------------------------------------------------- |
| `siteURL`        | string | Public URL, used for canonical and Open Graph tags.         |
| `name`           | string | Rendered in the header and as the resume title.             |
| `shortDesc`      | string | Header subtitle and `<meta name="description">`.            |
| `description`    | string | Paragraph inside the profile card.                          |
| `profilePicture` | string | Path under `public/`, e.g. `/img/pp.jpeg`.                  |
| `githubAPI`      | string | `https://api.github.com/users/<login>`, no trailing slash.  |
| `socialLinks`    | object | `{ key: { iconLink, name, link } }`, rendered in key order. |

### Projects — `src/config/content/<slug>.md`

```yaml
---
title: Project name
description: One or two lines shown on the card.
languages: [Astro, TypeScript]
imageUrl: /media/ProjectsImg/my-project.webp
date: 2025-09-28T00:00:00Z
---

Markdown body, rendered at `/my-project`.
```

`title` and `description` are required; `date`, `imageUrl` and `languages` are optional. The
filename is the route. Cards are ordered by `date`, newest first (`src/lib/projects.ts`), and
dates are formatted in UTC.

### Resume — `src/config/UserResume.md`

Plain Markdown. Headings, tables, lists, quotes and code blocks are styled by `.mdContent` in
`src/styles/global.css`; tables scroll horizontally on narrow screens.

### Theme — `src/config/theme.css`

Colors are Tailwind tokens:

```css
@theme {
  --color-primary-500: var(--color-emerald-500);
  --color-bg-dark: var(--color-gray-900);
  --color-fg-dark: var(--color-gray-800);
}
```

Fonts are declared in `src/styles/global.css` through `--font-sans` and `--font-mono`.

### GitHub section

`src/components/Utils/GithubRepos.astro` is a server island: it renders after the page HTML and
fetches `<githubAPI>/repos` at request time. `GITHUB_API_KEY` is optional; unauthenticated
requests are limited to 60 per hour. API failures render an inline message instead of an error
page.

## Scripts

| Command           | Action                               |
| :---------------- | :----------------------------------- |
| `npm run dev`     | Dev server on `localhost:4321`        |
| `npm run build`   | Production build into `dist/`         |
| `npm run preview` | Serve the production build locally    |
| `npm run astro`   | Astro CLI                             |

## Structure

```text
src/
├── config/            UserData.json, UserResume.md, theme.css, content/*.md
├── content.config.ts  "projects" collection schema (Zod)
├── lib/               animations, theme/menu state, dates and URLs, sorting
├── components/        UI (design system) and Utils (data driven sections)
├── layouts/           Layout.astro: head, SEO/OG, shell, router
└── pages/             index, [...id], resume
```

## Deployment

Netlify: build command `npm run build`, publish directory `dist`. Set `GITHUB_API_KEY` in the
site environment variables if you use a token.

Two behaviors worth knowing:

- `astro dev` disables Netlify's local emulation (`NETLIFY_DEV` in `astro.config.mjs`), because its
  bundled edge runtime passes a flag that Deno 2.x rejects. Builds are not affected.
- The theme is applied by an inline `<head>` script and re-applied on `astro:after-swap`, since the
  ClientRouter replaces `<html>` attributes on navigation. Animations are skipped when the user
  prefers reduced motion.
