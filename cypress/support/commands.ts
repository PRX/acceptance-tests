/// <reference types="cypress" />
// ***********************************************

// Keeps requesting a URL until it contains and XML <item>
function waitForRssItems(url, title, retries = 0) {
  cy.request({ url: url, failOnStatusCode: false }).then((resp) => {
    if (resp.status === 200) {
      const parser = new DOMParser();

      const xml = resp.body;
      const doc = parser.parseFromString(xml, "application/xml") as XMLDocument;

      const items = doc.querySelectorAll("item");

      if (items.length) {
        const episode = [...items][0];
        const episodeTitle = episode
          .getElementsByTagName("title")[0]
          .textContent.trim();

        const enclosure = episode.getElementsByTagName("enclosure")[0];
        const enclosureUrl = enclosure.getAttribute("url");
        const enclosureLength = enclosure.getAttribute("length");

        if (title === episodeTitle) {
          expect(title).to.equal(episodeTitle);
          expect(enclosureLength).to.equal("40557");
          return;
        }
      }
    }

    cy.log("Still waiting for episode to hit RSS feed…");
    cy.wait(Math.min(10000, 2 ** retries * 1000));
    waitForRssItems(url, title, (retries += 1));
  });
}

Cypress.Commands.add("waitForRssItems", waitForRssItems);

declare global {
  namespace Cypress {
    interface Chainable {
      waitForRssItems(url: string, retries: number): Chainable<void>;
    }
  }
}
