/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(username: string, password: string): Chainable<any>;
  }

  interface Chainable<Subject = any> {
    waitForRssItems(url: string, title: string, checkImage: boolean, retries?: number): Chainable<any>;
  }
}
