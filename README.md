# Portfolium

Personal portfolio and resume, built with Astro 5, Tailwind CSS 4 and GSAP.
Everything on the site comes from two files: `UserData.json` (profile, links, GitHub user)
and `UserResume.md` (the resume itself). Projects are plain Markdown files.

## Stack

| Layer      | Choice                                                   |
| :--------- | :------------------------------------------------------- |
| Framework  | Astro 5 (hybrid rendering, content collections)          |
| Styling    | Tailwind CSS 4 via `@tailwindcss/vite` + custom theme     |
| Motion     | GSAP (single animation module, respects reduced motion)  |
| Icons      | Phosphor Icons (React)                                   |
| Deploy     | Netlify adapter (server islands for the GitHub section)  |

## Project structure

```text
src/
├── config/
│   ├── UserData.json          # profile, social links, siteURL, GitHub API URL
│   ├── UserResume.md          # resume rendered at /resume
│   ├── theme.css              # colors (Tailwind @theme tokens)
│   └── content/*.md           # one Markdown file per project
├── content.config.ts          # "projects" collection schema (Zod)
├── lib/
│   ├── animations.ts          # all GSAP timelines/tweens + menu open/close
│   ├── site.ts                # theme toggle, nav actions, loading state
│   ├── format.ts              # date/URL helpers (UTC safe)
│   └── projects.ts            # canonical project sorting
├── components/
│   ├── UI/                    # design system: Header, ContentCard, ProfileCard...
│   └── Utils/                 # data driven: local projects, GitHub repos
├── layouts/Layout.astro       # <head>, SEO/OG, header, side menu, router
└── pages/
    ├── index.astro            # profile + projects + GitHub
    ├── [...id].astro          # project detail (/<slug>)
    └── resume.astro           # /resume
```

## Customizing

**Profile** — edit `src/config/UserData.json`. `siteURL` must be the public URL
(with or without `https://`, it is normalized) because it feeds canonical/Open Graph tags.

**Resume** — edit `src/config/UserResume.md`. Markdown tables, lists and code blocks
are styled by `.mdContent` in `src/styles/global.css`.

**Projects** — add `src/config/content/MyProject.md`:

```yaml
---
title: My Project
description: One or two lines shown on the card.
languages: [Astro, TypeScript]
imageUrl: /media/ProjectsImg/my-project.webp
date: 2025-09-28T00:00:00Z
---
Markdown body rendered at /MyProject
```

Cards are ordered newest first (`src/lib/projects.ts`), both on the home page and in
the side menu.

**Colors** — edit `src/config/theme.css`; the palette is exposed as Tailwind tokens
(`bg-primary-500`, `bg-bg-dark`, `text-text-light`, ...).

**Github section** — the repository list is a *server island* fetched at request time
from `https://api.github.com/users/<user>` (set in `UserData.json`). Copy
`.env.example` to `.env` and add a `GITHUB_API_KEY` to avoid the 60 req/h anonymous
limit. Without a token the section still works, and failures render an inline message
instead of breaking the page.

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Dev server on `localhost:4321`              |
| `npm run build`   | Production build into `./dist/`             |
| `npm run preview` | Preview the production build locally        |

## Notes

- Theme preference lives in `localStorage` and is applied by an inline script in the
  `<head>`, so there is no flash of the wrong theme on load or navigation.
- Navigation uses Astro's `ClientRouter`; all motion is re-initialized on
  `astro:page-load` from `src/lib/animations.ts`.
- Animations are skipped entirely when the user prefers reduced motion.
