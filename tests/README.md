# tojis-birthdayyy

A tiny single-page birthday puzzle: answer 6 questions correctly to unlock the letters of a secret word ("FOSSIL") and reveal a surprise!

The page is pure HTML/CSS/JS, with:

- **index.html** – layout, questions, and letter display.
- **style.css** – dark blue themed styling.
- **script.js** – quiz logic, date parsing, progress tracking, and confetti hook.
- **tests/** – automated tests:
  - `tests/unit/` – unit tests with Vitest (e.g. date parsing).
  - `tests/e2e/` – end‑to‑end tests with Playwright.

---

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)

Playwright and Vitest are installed as dev dependencies via npm.

---

## Installation & setup

From the project root:

```bash
npm install
npm run setup
```

The `setup` script will:

- Ensure dev dependencies for tests exist:
  - `@playwright/test`
  - `@types/node`
  - `vitest`
  - `jsdom`
- Install Playwright browsers (`npx playwright install`).

You only need to run `npm run setup` on a fresh clone or when setting up on a new machine.

---

## Running the app locally

Start a simple static dev server on port 3000:

```bash
npm run dev
```

This uses `serve` under the hood and will print a URL like:

```text
http://localhost:3000
```

Open that URL in your browser to play with the birthday puzzle.

---

## Running tests

### Unit tests (Vitest)

Unit tests live under `tests/unit/`. To run them:

```bash
npm test        # or
npm run test:unit
```

These use a jsdom environment to exercise logic like `normalizeYear` and `tryParseDate` from `script.js` without a real browser.

### End‑to‑end tests (Playwright)

E2E tests live under `tests/e2e/` and drive the real page in a headless browser.

1. In one terminal, start the dev server:

   ```bash
   npm run dev
   ```

2. In another terminal, run the Playwright tests:

   ```bash
   npm run test:e2e
   ```

To use the interactive UI runner:

```bash
npm run test:e2e:ui
```

The main e2e spec (`tests/e2e/index.spec.js`) walks through answering all 6 questions, checking validation messages, and verifying that the letters reveal correctly and the final birthday message appears when progress reaches 6/6.

---

## Project scripts

Defined in `package.json`:

- `npm run dev` – serve the app on `http://localhost:3000`.
- `npm test` – run Vitest test suite (alias for unit tests).
- `npm run test:unit` – run unit tests with Vitest explicitly.
- `npm run test:e2e` – run Playwright end‑to‑end tests.
- `npm run test:e2e:ui` – open Playwright test runner UI.
- `npm run setup` – install test dev dependencies and Playwright browsers.

---

## Folder structure

```text
.
├── index.html                # Main page
├── style.css                 # Styling
├── script.js                 # Quiz logic and helpers
└── tests                     # Test workspace (this folder)
    ├── package.json          # Test-only package (Vitest + Playwright deps)
    ├── README.md             # This README
    ├── .gitignore            # Ignore Playwright artifacts, node_modules, etc.
    ├── playwright.config.js  # Playwright config (points at ./e2e)
    ├── vitest.config.mts     # Vitest config (points at ./unit)
    ├── unit/                 # Vitest unit specs
    │   └── script.spec.js    # Unit tests for script.js
    └── e2e/                  # Playwright e2e specs
        └── index.spec.js     # End-to-end tests for the main page
```

---

## GitHub Actions (CI)

This repo has two GitHub Actions workflows under `.github/workflows/`:

- **Vitest (`vitest.yml`)**
  - Runs `npm run test:unit` in the `tests/` workspace.
  - Only triggers on **pull requests targeting `main`**.
  - Skips **draft** PRs; it runs only when the PR is marked *ready for review*.

- **Playwright (`playwright.yml`)**
  - Runs `npx playwright test` using the root `package.json` and `playwright.config`.
  - Triggers on **pull requests targeting `main` or `master`**.
  - Also skips **draft** PRs and only runs when the PR is *ready for review*.

This means CI will only run the full test suite once your PR is ready, avoiding noisy runs while you are still drafting changes.

### Making checks required (blocking merges into `main`)

To have these workflows **block merging** when tests fail:

1. In your GitHub repo, go to **Settings → Branches → Branch protection rules**.
2. Create or edit a rule with **Branch name pattern** set to `main`.
3. Enable **Require status checks to pass before merging**.
4. In the list of checks, add the following as **required**:
   - `Vitest / unit-tests`
   - `Playwright Tests / test`
5. Save the rule.

With this in place:

- Any non-draft PR targeting `main` will run Vitest and Playwright.
- If either workflow fails, its check is red and the PR **cannot be merged** until the issues are fixed.

---

## Notes

- All logic for accepted answers and target date is centralized in the `ACCEPTED` object at the top of `script.js`.
- The confetti hook `launchConfetti()` is stubbed so you can plug in any confetti library without changing the tests.
- Date input supports multiple formats (`26/11/2025`, `11/26/2025`, ISO, month names, etc.); the unit tests document and lock in this behavior.
