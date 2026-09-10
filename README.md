# NOVA Studio

An independent studio website that brings brand work, digital craft and a direct project conversation into one editorial experience.

![Desktop](docs/screenshots/desktop.png)

![Case Study](docs/screenshots/case-study.png)

![Mobile](docs/screenshots/mobile.png)

## Key features

- Four detailed project case studies with keyboard-accessible native dialogs.
- Brand/digital filtering with visible state and live announcements.
- Responsive navigation, progressive section reveals, animated counters and restrained pointer interaction.
- Services, process, studio, collaborator quote and a private project brief builder.
- Validated brief form exports entered content without transmitting personal information.

## Technology

HTML5, CSS, vanilla JavaScript, Vite, ESLint, Prettier and Playwright.

## Local development

Requires Node.js 24 and npm.

~~~bash
npm ci
npm run dev
~~~

Open the local URL printed by Vite. There are no demo accounts or runtime secrets for this frontend-only project.

## Configuration

See .env.example. BASE_PATH is passed as an environment variable to Vite. Local builds default to ./ so assets remain relative. Repository Pages builds use /prfio-nova-studio/.

~~~bash
npm run lint
npm run build
npm run preview
~~~

## Testing

~~~bash
npx playwright install chromium
npm test
~~~

Playwright starts a server on port 5191 and checks interactions, validation responsive layouts and automated axe accessibility checks. Captures go to docs/screenshots. See [QA.md](QA.md) for execution evidence. CI runs the suite before publishing.

## Deployment

The included GitHub Actions workflow validates, builds with the repository base path, uploads dist and deploys through GitHub Pages. Set **Settings → Pages → Source → GitHub Actions**, then push main or run the workflow manually. No live URL is claimed until publication succeeds.

~~~bash
gh auth login
gh repo create prfio-nova-studio --public --source=. --remote=origin --push
gh api --method POST repos/{owner}/prfio-nova-studio/pages -f build_type=workflow
gh workflow run pages.yml
~~~

Replace {owner} with your GitHub login. If a remote exists, inspect it first; never force-push unrelated history. Description and topics are in .github/repository.json.

## Architecture and structure

~~~text
src/                 Application logic, styles and local data
public/              Local media, icons and credits page
index.html           Entry document
vite.config.js       Build and repository base configuration
tests/               Browser and domain checks
docs/screenshots/    Running application captures
.github/workflows/   Validation and Pages deployment
~~~

Product-specific modules own UI behaviour. Static media stays local. main.js owns navigation and interaction orchestration. Case study content and brief export stay local.

## Scope and limits

The contact section exports a private brief and has no submission service. The featured identities form a curated design collection and do not assert commercial client outcomes. No analytics, cookies or external fonts are used.

## Design and credits

[DESIGN.md](DESIGN.md) records the visual system. [CREDITS.md](CREDITS.md) records research, media and icon provenance. MIT-licensed source; dependencies retain their original licences.
