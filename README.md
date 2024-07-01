# PRX Acceptance Tests

Acceptance tests for PRX systems using Cypress.

## What is Cypress?

Cypress is a next-generation front end testing tool built for the modern web.
It enables you to write all types of tests:
- End-to-end tests
- Integration tests
- Unit tests

We're using for E2E tests to cover core functionality of apps at PRX.

## Requirements

- [Node.js](https://nodejs.org/) (preferably managed with [asdf](https://github.com/asdf-vm/asdf))
- [Yarn](https://yarnpkg.com/)

## Installation

1. Clone this repository
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Configure your test user/pass/fixtures:
   ```sh
   cp env-example .env
   # Edit .env with your settings
   ```

## Running Tests

There are two main ways to run Cypress tests:

### Headless Mode (Run)

Run tests in headless mode:
```sh
yarn test
```

This command runs all tests in the terminal without opening a browser window.
It's useful for continuous integration environments or when you want to quickly
run all tests.

### Interactive Mode (Open)

Open Cypress Test Runner:
```sh
yarn start
```

This command opens the Cypress Test Runner, a graphical user interface that allows you to:
- See all test files
- Choose specific tests to run
- Watch tests run in real time in the browser
- Debug tests using browser developer tools

The Test Runner is particularly useful during test development and debugging.
You can set a `debugger` statement or inspect the DOM!

## Writing Tests

Cypress tests are located in the `cypress/e2e` directory. To create a new test:

1. Create a new `.cy.ts` file in the `cypress/e2e` directory
2. Write your test using Cypress commands
3. Run your test using the Cypress Test Runner or command line

For more information on writing Cypress tests, refer to the [Cypress Documentation](https://docs.cypress.io/).

## License

[MIT License](LICENSE)

## Contributing

1. Fork it
2. Create your feature branch (git checkout -b feat/my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin feat/my-new-feature)
5. Create new Pull Request
