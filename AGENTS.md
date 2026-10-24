# AGENTS.md

Instructions for AI agents asked to set up this portfolio for a user. Read this file before
editing anything.

## Scope

Configure content only. Behavior, layout and build tooling already work and must not be changed
unless the user explicitly asks for a feature or a bug fix.

Editable:

| Path                          | Purpose                                   |
| :---------------------------- | :---------------------------------------- |
| `src/config/UserData.json`    | Name, bio, photo, links, site URL         |
| `src/config/content/*.md`     | One file per project                      |
| `src/config/UserResume.md`    | Resume body at `/resume`                  |
| `src/config/theme.css`        | Colors, only when the user asks for a theme change |
| `public/img/**`               | Avatar and social icons                   |
| `public/media/ProjectsImg/**` | Project cover images                      |

Everything else (`src/lib`, `src/components`, `src/layouts`, `src/pages`, `astro.config.mjs`,
`package.json`) is application code.

## Inputs to collect

Ask only for values that are missing. Do not invent personal data.

- `name`, `shortDesc` (e.g. "Fullstack Developer"), `description` (2–4 sentences)
- `siteURL` (final public domain; protocol optional)
- avatar image or an existing path
- social links (label, URL, icon)
- GitHub username
- projects: title, description, tech tags, date, cover image, Markdown body
- resume content

## UserData.json

```json
{
  "siteURL": "https://example.dev",
  "name": "Jane Doe",
  "description": "Backend developer working with Go and Postgres.",
  "shortDesc": "Backend Developer",
  "profilePicture": "/img/pp.jpeg",
  "githubAPI": "https://api.github.com/users/janedoe",
  "socialLinks": {
    "github": {
      "iconLink": "/img/icons/github-logo.svg",
      "name": "Github",
      "link": "https://www.github.com/janedoe"
    }
  }
}
```

Rules:

- `githubAPI` is always `https://api.github.com/users/<login>`. No trailing slash.
- `profilePicture` and every `iconLink` are absolute paths under `public/` (start with `/`).
- `socialLinks` order is the render order. Keys are arbitrary; each value needs all three fields.
- `siteURL` feeds canonical and Open Graph tags. It is used as-is, so it must match the deployed
  domain.
- Valid JSON, UTF-8, two-space indentation. Keep keys the user did not ask to change.

## Projects

File: `src/config/content/<slug>.md`. The filename becomes the route, so use lowercase and
hyphens (`smart-home.md` → `/smart-home`). One project per file, no subdirectories.

```markdown
---
title: Smart Home Dashboard
description: Local-first dashboard for Zigbee devices.
languages: [TypeScript, Astro]
imageUrl: /media/ProjectsImg/smarthome.webp
date: 2025-09-28T00:00:00Z
---

## Overview

Body in Markdown. Headings start at `##` (the page already renders the title as `h1`).
```

Schema (`src/content.config.ts`): `title` and `description` are required strings; `date` is an
optional ISO 8601 datetime in UTC; `imageUrl` is an optional path under `public/`; `languages` is
an optional string array rendered as tags. Omit `imageUrl` rather than leaving it empty — cards
without an image render correctly.

Ordering is automatic (newest `date` first); do not sort files manually.

## Resume

`src/config/UserResume.md` is rendered by `/resume`. Use plain Markdown: headings, lists, tables,
blockquotes, code blocks and links. The page header already shows the user's `name` from
`UserData.json`, so do not repeat it as an `h1` inside the file. Frontmatter is optional and
supports `title` and `date`.

## Images

- Avatar: square, at least 320×320, reference it as `/img/pp.jpeg` (extension as delivered).
- Project covers: 16:9 or wider, ~1200px, WebP preferred, under `public/media/ProjectsImg/`.
- Existing social icons live in `public/img/icons/`; reuse them when a matching network exists.
- Never reference images from `src/` or with relative `../` paths.

## Secrets

`GITHUB_API_KEY` belongs in `.env` (gitignored) or in the deploy platform's environment
variables. Never write tokens, passwords or personal contact details into tracked files. The
GitHub section works without a token (60 requests/hour).

## Workflow

1. Read `src/config/UserData.json`, `src/config/content/*.md`, `src/config/UserResume.md` and
   `public/` to know what already exists.
2. Collect missing inputs; stop and ask instead of inventing facts.
3. Apply edits with minimal diffs. Replace the demo persona (`John Doe`) and the five sample
   projects; leave none of the placeholder content behind unless the user wants to keep it.
4. Verify:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/config/UserData.json','utf8')); console.log('json ok')"
npm run build          # must end with "Complete"
```

5. Report the files changed, the routes generated, and any value still requiring the user's input.

## Verification checklist

- [ ] `UserData.json` parses and every path it references exists in `public/`
- [ ] `siteURL` is the real domain; no `example.com`/`localhost` left in content
- [ ] Every project file has `title` and `description`; dates are ISO 8601 UTC
- [ ] `npm run build` prints `Complete` and lists one route per project file
- [ ] No demo data (`John Doe`, `octocat`, `johndoe@…`, sample projects) remains
- [ ] No secret or token committed

## Site behavior (do not "fix" these)

- The theme is applied by an inline script in `src/layouts/Layout.astro` and re-applied on
  `astro:after-swap`; the ClientRouter replaces `<html>` attributes on navigation.
- GSAP animations live in `src/lib/animations.ts` and are disabled under
  `prefers-reduced-motion`.
- `astro dev` sets `NETLIFY_DEV` to skip Netlify's local emulation, which is incompatible with
  Deno 2.x. Builds are unaffected.
- UI strings are English. Content can be in any language.
