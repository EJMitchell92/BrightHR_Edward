# BrightHR_Edward
Edward BrightHR Automation technical task
Project purpose

Tech: Playwright + TypeScript

Setup with .env.example

How to run tests

How CI is configured

Folder structure overview


# Playwright E2E – Employees

## Setup
1. `npm ci`
2. Copy `.env.example` to `.env` and fill:
   - `BASE_URL=https://...`
   - `ADMIN_EMAIL=...`
   - `ADMIN_PASSWORD=...`

## Run
- `npm test`
- `npm run report` to open the HTML report

## CI
GitHub Actions workflow at `.github/workflows/ci.yml` runs tests on push and PR.
