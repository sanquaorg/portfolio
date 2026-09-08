# Portfolio — Architecture & Code Walkthrough

A learning-oriented tour of how this site is built. Read top to bottom once, then
use it as a map when you edit things.

---

## 1. The big picture

```
             build time (your machine or GitHub Actions)
 ┌─────────────────────────────────────────────────────────────┐
 │  npm run build                                              │
 │   ├─ 1. scripts/fetch-data.mjs                              │
 │   │      Medium RSS  ──►  data/medium.json                  │
 │   │      YouTube API ──►  data/youtube.json                 │
 │   └─ 2. next build  (output: "export")                     │
 │          React pages + JSON + content/*.ts  ──►  out/       │
 │          (pure static HTML/CSS/JS, no server)              │
 └─────────────────────────────────────────────────────────────┘
                              │
                     out/  uploaded to
                              ▼
                   GitHub Pages  ──►  https://sanquaorg.github.io/portfolio/
```

Key idea: **there is no server and no database.** Every page is rendered to a
plain HTML file *once* at build time. Data that changes (videos, articles) is
pulled from public APIs during the build, frozen into JSON, and baked into the
HTML. A daily scheduled build keeps it fresh.

This is called **Static Site Generation (SSG)** / **static export**.

---

## 2. Tech stack and why each piece is here

| Piece | Role | Why this one |
|---|---|---|
| **Next.js 14 (App Router)** | React framework, routing, build | File-based routing, first-class static export, image handling |
| **`output: "export"`** | Turns the app into static files | No Node server needed → free hosting on GitHub Pages |
| **React (Server Components)** | UI | Pages are components; most run only at build time |
| **TypeScript** | Types | Catches typos in data shapes before they ship |
| **Tailwind CSS** | Styling | Utility classes in markup, no separate CSS files to manage |
| **CSS variables** | Theming (light/dark) | One set of color tokens, swapped by `prefers-color-scheme` |
| **`next/font/google`** | Fonts (Inter + Sora) | Downloads fonts at build → self-hosted, no runtime request to Google |
| **lucide-react** | Icons | Tree-shakeable SVG icon components |
| **Node script + `fetch`** | Build-time data | No CMS; APIs are public; JSON is easy to cache/commit |
| **GitHub Actions** | CI/CD | Builds and deploys on push + daily cron |
| **GitHub Pages** | Hosting | Free, static, HTTPS, custom-domain capable |

---

## 3. Directory layout

```
Portfolio/
├── app/                    # pages + layout (Next.js App Router)
│   ├── layout.tsx          # <html>/<body> shell, fonts, <Nav>, <footer>, metadata
│   ├── globals.css         # color tokens, base styles, component classes
│   ├── page.tsx            # "/"  — home
│   ├── youtube/page.tsx    # "/youtube/"
│   ├── medium/page.tsx     # "/medium/"
│   ├── skills-projects/page.tsx
│   ├── education/page.tsx
│   ├── not-found.tsx       # styled 404
│   └── icon.svg            # favicon (Next serves it automatically)
│
├── components/             # reusable UI (mostly server components)
│   ├── Nav.tsx             # "use client" — needs usePathname for active link
│   ├── Section.tsx         # icon + heading + accent underline
│   ├── Card.tsx            # bordered surface, optional link + hover lift
│   ├── Chip.tsx            # small pill (skills, tags)
│   ├── Timeline.tsx        # vertical rule + dots (experience, education)
│   ├── Reveal.tsx          # "use client" — fade-in on scroll (IntersectionObserver)
│   ├── SocialLinks.tsx     # icon row from profile.socials
│   └── BrandIcons.tsx      # inline SVGs for GitHub / YouTube / Medium
│
├── content/               # YOUR editable text — no code logic
│   ├── profile.ts          # name, title, about paragraphs, socials
│   ├── resume.ts           # skills, experience, projects, education, certs
│   └── types.ts            # TS types for the fetched JSON
│
├── data/                  # generated — do not hand-edit
│   ├── medium.json
│   └── youtube.json
│
├── scripts/
│   ├── fetch-data.mjs      # the build-time fetcher
│   └── preview.mjs         # tiny static server for out/ (npm run preview)
│
├── public/                # copied verbatim to the site root
│   └── photo.webp
│
├── .github/workflows/deploy.yml   # CI/CD
├── next.config.mjs        # output: export, basePath, images
├── tailwind.config.ts     # fonts, brand color, keyframes
└── package.json           # scripts: predev/prebuild run the fetcher
```

Mental model of the three data folders:
- **`content/*.ts`** — you type this by hand. Static facts about you.
- **`data/*.json`** — a robot writes this. Refreshed every build.
- **`public/`** — raw files (images) served as-is.

---

## 4. How a request actually works (there is no request)

When someone opens `https://sanquaorg.github.io/portfolio/youtube/`:

1. GitHub Pages serves `out/youtube/index.html` — a file that already exists.
2. That HTML already contains the video titles, thumbnails, view counts —
   they were written into it during `next build`.
3. The browser then loads a small JS bundle that "hydrates" the page (makes the
   client components like `Nav` and `Reveal` interactive).

Nothing runs on a server. The YouTube API is *never* called from the browser —
only from `fetch-data.mjs` at build time. That's why the API key can stay a
secret and never appears in the shipped site.

---

## 5. The build-time data fetch (`scripts/fetch-data.mjs`)

This is the only "backend" in the project. It runs automatically because
`package.json` has:

```json
"predev":   "node scripts/fetch-data.mjs",
"prebuild": "node scripts/fetch-data.mjs"
```

npm runs a `preX` script right before `X`. So `npm run build` always fetches first.

### Medium (`fetchMedium`)
- Medium exposes a public RSS feed at `https://medium.com/feed/@username`. No key.
- The script fetches the XML and parses it with **regexes** (not an XML library —
  keeps dependencies at zero). `matchAll(/<item>...<\/item>/)` grabs each post;
  `tag(block, "title")` pulls one field; `decode()` unescapes `&amp;` etc.
- For each post it extracts title, link, date, categories, first image, and a
  220-char excerpt (HTML stripped).
- Output shape: `{ fetchedAt, items: [...] }` → `data/medium.json`.

### YouTube (`fetchYouTube`)
Needs `YOUTUBE_API_KEY` (a GitHub Actions secret). Three API calls:
1. `channels?forHandle=Mining2003` → resolve the `@handle` to a channel ID + stats.
2. `search?channelId=…&order=viewCount` → the most-viewed video IDs.
3. `videos?id=id1,id2,…` → full snippet + statistics for those IDs
   (the search endpoint doesn't return view counts, hence the second call).
- Output: `{ fetchedAt, channel: {...}, items: [...] }` → `data/youtube.json`.

### Graceful degradation
Every fetch is wrapped in `try/catch`. On any failure (network blocked, no key,
API quota) it calls `keepExisting()` — reads the JSON that's already on disk and
reuses it. **The build never fails because an API is down.** This is why the site
still works when you build on a corporate network that blocks Medium.

---

## 6. How pages consume the data

Pages are **React Server Components** — they run during `next build`, not in the
browser. So they can just `import` JSON and `.ts` files directly:

```tsx
// app/youtube/page.tsx (shape)
import ytData from "@/data/youtube.json";
import type { YouTubeData } from "@/content/types";

const yt = ytData as YouTubeData;   // cast: empty JSON infers as never[]

export default function YouTubePage() {
  return yt.items.map(v => <Card key={v.id} href={v.url}>…</Card>);
}
```

The `as YouTubeData` cast exists because when `youtube.json` starts as
`{ "items": [] }`, TypeScript infers `items: never[]` and complains about
`v.title`. `content/types.ts` declares the real shape and the cast applies it.

`@/` is a path alias (set in `tsconfig.json`) meaning "project root", so
`@/content/profile` instead of `../../content/profile`.

---

## 7. The layout shell (`app/layout.tsx`)

Every page is wrapped in this. It:
- Loads **Inter** and **Sora** via `next/font/google`. Each returns an object with
  a `.variable` class (`--font-sans`, `--font-display`). Those classes go on
  `<html>`, and `globals.css` / Tailwind read the CSS variables. Fonts are
  downloaded and self-hosted at build — no request to Google's servers at runtime.
- Renders `<Nav />`, the `<main>` container (`max-w-4xl` centered), and the footer.
- Exports a `metadata` object — Next turns this into `<title>`, `<meta>`,
  Open Graph and Twitter-card tags. `title.template` (`"%s — Sanjaybalaji…"`)
  means each page just sets its own short title and the suffix is added.

---

## 8. Styling system

### Color tokens (`app/globals.css`)
All colors are CSS variables defined twice:

```css
:root                              { --bg: #fff;  --text: #0f172a; --brand: #4f46e5; … }
@media (prefers-color-scheme: dark){ :root { --bg: #0b1120; --text: #e2e8f0; --brand: #818cf8; … } }
```

Dark mode is **automatic** — it follows the OS setting. There is no toggle. The
browser picks the matching block; nothing in JS.

### Tailwind bridge (`tailwind.config.ts`)
- `fontFamily.sans` / `.display` point at the font CSS variables → `font-display`
  utility works in markup.
- `colors.brand` is `rgb(var(--brand-rgb) / <alpha-value>)`. The weird
  `<alpha-value>` placeholder is what lets you write `bg-brand/10` (brand at 10%
  opacity). That only works if the variable is raw channels (`79 70 229`), not
  `#4f46e5` — that's why `--brand-rgb` exists alongside `--brand`.
- `darkMode: "media"` — matches the CSS approach above.

### Component classes (`@layer components` in globals.css)
A few patterns repeat enough to name:
- `.surface` — card background + border.
- `.hero-gradient` — the stacked radial/linear gradients behind the home hero.
- `.link-underline` — an underline that grows from 0→100% width on hover, done
  with an animated `background-size` (cheaper than animating `width`).

### Motion
- `.reveal` starts fully visible (progressive enhancement). `Reveal.tsx` only
  *arms* it (`data-armed="true"` → starts hidden) after mount, then an
  `IntersectionObserver` adds `.is-visible` when it scrolls into view. If JS never
  runs, content is still there.
- `@media (prefers-reduced-motion: reduce)` kills every transition/animation and
  disables the reveal offset.

---

## 9. Client vs Server components

By default every component in `app/` is a **Server Component** — runs at build,
ships zero JS. A file needs `"use client"` at the top only if it uses browser
APIs or React state/effects. In this project only two do:

| Component | Why it's a client component |
|---|---|
| `Nav.tsx` | `usePathname()` to highlight the active link |
| `Reveal.tsx` | `IntersectionObserver` + `useEffect` |

Everything else (`Card`, `Chip`, `Section`, `Timeline`, `SocialLinks`, all pages)
is server-rendered to static HTML.

---

## 10. `basePath` — the GitHub Pages gotcha

The site lives at `sanquaorg.github.io/**portfolio**/`, not at the domain root.
So every asset URL needs a `/portfolio` prefix. `next.config.mjs`:

```js
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";  // "/portfolio" in CI, "" locally
const nextConfig = { output: "export", basePath, images: { unoptimized: true }, trailingSlash: true };
```

- The deploy workflow sets `NEXT_PUBLIC_BASE_PATH=/portfolio`.
- Local dev leaves it empty → `http://localhost:3000/`.
- `<Link href="/youtube/">` and `next/font` get the prefix added automatically.
- **`next/image` with a plain string `src` does NOT get the prefix** — that's the
  bug that broke the photo. Fix: `import photo from "@/public/photo.webp"` and
  pass the imported object. Next then fingerprints it and prefixes correctly.
- `images: { unoptimized: true }` is required — the Next image optimizer needs a
  server, which a static export doesn't have.
- `trailingSlash: true` makes each route a folder with `index.html`, which is how
  static hosts resolve `/youtube/`.

---

## 11. CI/CD (`.github/workflows/deploy.yml`)

Triggers: push to `main`, a daily `cron` (`0 6 * * *`), or manual
("Run workflow" button).

**build job** (Ubuntu):
1. `actions/checkout` — get the code.
2. `actions/setup-node` (Node 20, npm cache).
3. `npm ci` — clean install from `package-lock.json`.
4. `npm run build` with env: `YOUTUBE_API_KEY` (from repo secrets),
   `YOUTUBE_HANDLE`, `MEDIUM_USERNAME`, `NEXT_PUBLIC_BASE_PATH=/portfolio`.
   → runs the fetcher, then `next build`, producing `out/`.
5. `upload-pages-artifact` with `path: out`.

**deploy job**: `actions/deploy-pages` publishes the artifact to GitHub Pages.

`concurrency: { group: pages, cancel-in-progress: true }` — if you push twice
fast, the older run is cancelled.

The daily cron is the reason new videos/articles appear without you touching the
repo: the scheduled build re-runs the fetcher.

---

## 12. Security model

- **`YOUTUBE_API_KEY`** is only ever a GitHub Actions **secret** → injected as an
  env var → read by `fetch-data.mjs` → used to call Google → *the key itself is
  never written into any output file*. The shipped site contains only video
  metadata.
- **`.gitignore`** keeps out `node_modules`, `.next`, `out`, `.env*`, `.claude/`,
  and `*.docx`/`*.pdf` (résumé source docs — the site text lives in
  `content/*.ts`, the Word file was removed from git history entirely).
- Client/employer names in `content/*.ts` were generalized ("Analytics Consulting
  Firm", "a global gaming & entertainment platform") so the public repo doesn't
  expose them. The source code is intentionally public; only data was scrubbed.

---

## 13. Local development

```bash
npm install
npm run dev        # http://localhost:3000  (basePath empty)
```

```bash
npm run build      # produces out/  (set NEXT_PUBLIC_BASE_PATH=/portfolio to match prod)
npm run preview    # http://localhost:4321  serves out/ exactly as deployed
```

Quirks on this machine:
- The folder is in **OneDrive**. If `npm run dev` throws
  `EINVAL … readlink … .next\…`, delete the `.next` folder and retry — OneDrive
  turns cached files into cloud placeholders. `npm run build` is unaffected.
- The corporate network blocks the Medium RSS fetch locally, so the Writing page
  may be empty in local dev. It works in GitHub Actions.

---

## 14. How to change things

| I want to… | Edit |
|---|---|
| Change the about text / job title | `content/profile.ts` |
| Add a project / skill / certification | `content/resume.ts` |
| Swap the photo | replace `public/photo.webp` (keep the name, ~3:4 portrait) |
| Change the accent color | `--brand` + `--brand-rgb` (both light & dark) in `globals.css` |
| Change fonts | the `Inter` / `Sora` imports in `app/layout.tsx` |
| Add a new page | create `app/<name>/page.tsx`, add a link in `components/Nav.tsx` |
| Change how many videos show | `MAX_VIDEOS` in `scripts/fetch-data.mjs` |
| Point at a different YouTube/Medium account | env vars in `.github/workflows/deploy.yml` |

After any change: commit, push to `main`, watch the Actions tab go green,
hard-refresh the live site.

---

## 15. Concepts worth reading more about

- **Next.js App Router** — file-based routing, `layout.tsx` nesting.
- **React Server Components** — "runs on the server/at build, ships no JS".
- **Static export (SSG)** — pre-rendering vs SSR vs CSR.
- **`next/font`** — build-time font self-hosting.
- **CSS custom properties** — theming without a JS framework.
- **GitHub Actions** — jobs, steps, secrets, `cron` schedules.
- **`prefers-color-scheme` / `prefers-reduced-motion`** — CSS media queries that
  respect OS accessibility settings.
