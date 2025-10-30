# Project name: BrightHR_Edward

- Project automation coding challenge - https://github.com/brighthr/QA-Automation?tab=readme-ov-file
- My submission is written in playwright.
- Tests are located under Playwright > src > tests

## Tech:

Playwright + TypeScript

## Getting Started

## 1. Clone the repository

Usng bash
`git clone https://github.com/EJMitchell92/BrightHR_Edward.git`

## 2. Setup

1. Install packages locally: `npm install`
2. Create .env file in root. Add
   - `BASE_URL=https://...`
   - `ADMIN_EMAIL=...`
   - `ADMIN_PASSWORD=...`

## 3. Run tests

1. headless - `npm ci`
2. playwright UI headed mode: `npx playwright test --ui`

## 4. View reports

- `npm run report` to open the HTML report
- `npx playwright show-report`

## CI

GitHub Actions workflow at `.github/workflows/playwright.yml` runs tests on push and PR.
