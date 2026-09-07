# Portfolio

Personal site for Sanjaybalaji Prasanna. Next.js (App Router) with static export, deployed to GitHub Pages. No database — content comes from `content/*.ts` and two JSON files that a build script refreshes from public APIs.

## Pages

| Route | Content |
|---|---|
| `/` | Photo + about + links |
| `/youtube` | Most popular videos (YouTube Data API) |
| `/medium` | Articles (Medium RSS) |
| `/skills-projects` | Skills, experience, projects, achievements |
| `/education` | Education + certifications |

## Local development

Requires Node 20+ and git (neither is installed on the machine this was scaffolded on).

```bash
npm install
cp .env.example .env.local     # optionally add YOUTUBE_API_KEY
npm run dev                     # http://localhost:3000
```

`npm run dev` and `npm run build` both run `scripts/fetch-data.mjs` first. Without `YOUTUBE_API_KEY` the YouTube fetch is skipped and the existing `data/youtube.json` is kept. Medium needs no key. (On a locked-down corporate network both fetches may fail locally — that's fine, they succeed in GitHub Actions.)

To preview the real production output (static export, exactly what deploys):

```bash
npm run build
npm run preview                 # http://localhost:4321
```

### OneDrive note

This folder lives in OneDrive. If `npm run dev` ever throws `EINVAL: invalid argument, readlink ... .next\...`, delete the `.next` folder and re-run — OneDrive occasionally turns cached build files into cloud placeholders. `npm run build` is unaffected. Setting the folder to *"Always keep on this device"* in OneDrive avoids it.

## Content to edit

- **About text & links** — `content/profile.ts` (the `about` array is a draft from the résumé — rewrite it).
- **Résumé data** — `content/resume.ts`.
- **Photo** — `public/photo.webp` (portrait ~3:4 works well); update `photo` in `content/profile.ts` if you change the filename/extension.

## Deploying to GitHub Pages

1. Create a repo named **`portfolio`** under `github.com/sanquaorg` and push this folder to `main`.
   (Different repo name → change `NEXT_PUBLIC_BASE_PATH` in `.github/workflows/deploy.yml` to `/<repo-name>`, or leave empty for a `sanquaorg.github.io` repo / custom domain.)
2. Repo **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Repo **Settings → Secrets and variables → Actions → New repository secret**:
   - `YOUTUBE_API_KEY` — from Google Cloud Console → APIs & Services → enable *YouTube Data API v3* → Credentials → API key.
4. Push. The workflow builds and deploys; it also re-runs daily (cron) so new videos/articles appear without a push. Trigger manually any time from the Actions tab ("Deploy portfolio to GitHub Pages" → Run workflow).

Site URL: `https://sanquaorg.github.io/portfolio/`

## Custom domain (optional)

Add `public/CNAME` containing the domain, set `NEXT_PUBLIC_BASE_PATH` to empty in the workflow, and configure DNS per GitHub's docs.

---
Co-authored with Claude Code.
