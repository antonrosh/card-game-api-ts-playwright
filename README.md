# The Checkers Game - Automated Tests

This repository contains API automated tests for the Card Game. The tests were written using Playwright and TypeScript and implemented following steps:

1. Navigate to [https://deckofcardsapi.com](https://deckofcardsapi.com)
2. Confirm the site is up
3. Get a new deck
4. Shuffle it
5. Deal three cards to each of two players
6. Check whether either has blackjack
7. If either has, write out which one does

⚠️ Additional test cases and scenarios were added to the test suite and can be found in the card.game.test.ts file.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16.x)

### Setup

1. Clone the repository to your local machine.

```bash
git clone https://github.com/antonrosh/card-game-api-ts-playwright.git
cd card-game-api-ts-playwright
```

2. Install the project dependencies.

```bash
npm install
```

3. Create .env file in the root of your project and insert your key/value pairs in the following format of `KEY=VALUE`:

```bash
BASE_URL="https://deckofcardsapi.com"
```

⚠️ The .env file is included in .gitignore to prevent commiting secrets into the repository.
In pipeline uses GitHub secrets to store sensitive information like the BASE_URL.

## Running the Tests

To run the tests locally, execute the following command:

```bash
npx playwright test
```

Additional settings can be found in the [Playwright documentation](https://playwright.dev/) and playwright.config.ts file.

## CI/CD

This project is configured with GitHub Actions for Continuous Integration.

The current configuration (.github/workflows/playwright.yml) is setup to run tests on both push and pull_request events against the main branch. The job will setup Node.js environment, install dependencies, and run tests using Playwright. After the tests are completed, it uploads the test report as an artifact.

## Reports

The Playwright HTML report for the tests is available [here](https://github.com/antonrosh/card-game-api-ts-playwright/actions/workflows/playwright.yml). You can download the report by clicking on the "playwright-report" link under the "Artifacts" section in each workflow run.

## Implementation

This project uses Playwright for writing API tests in JavaScript/TypeScript. Playwright is a Node.js library for browser automation. It provides a high-level API to control headless or non-headless browsers.

A page object model is used to structure the tests, making the test code more readable, maintainable, and reusable.

## Project Structure

```bash
├── .github/                       # Contains GitHub files
│   └── workflows/                 # Contains GitHub Action files
│       └── playwright.yml         # GitHub Actions Playwright workflow
├── api/                           # Contains page classes
│   └── deck.api.ts                # deckApi class
├── tests/                         # Contains all tests
│   └── card.game.test.ts          # Tests for DeckApi
├── .env                           # Contains environment variables
├── .gitignore                     # Specifies intentionally untracked files to ignore
├── package-lock.json              # Locks down the versions of a project's dependencies
├── package.json                   # Contains scripts and dependencies of the project
├── playwright.config.ts           # Playwright test runner configuration file
└── README.md                      # README file with a template for your project
```

## Contact

- Anton Rosh - me@antonrosh.dev
- Project Link - [https://github.com/antonrosh/checkers-game-ts-playwright](https://github.com/antonrosh/card-game-api-ts-playwright)
