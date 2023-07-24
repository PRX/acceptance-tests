/// <reference types="cypress" />
// ***********************************************

// Login via ID and cache the session cookie
Cypress.Commands.add("login", (username, password) => {
  const args = { username, password };

  cy.session(args, () => {
    cy.origin(Cypress.env("ID_HOST"), { args }, ({ username, password }) => {
      cy.visit(`https://${Cypress.env("ID_HOST")}/`);
      cy.contains("Sign in");
      cy.get("#login").type(username);
      cy.get("#password").type(password);
      cy.get(".btn.submit").click();
      cy.contains("Welcome");
    });
  });
});

// Keeps requesting a URL until it contains and XML <item>
function waitForRssItems(url, title, checkImage = false, retries = 0) {
  const now = new Date().getTime();

  cy.request({ url: `${url}?cb=${now}`, failOnStatusCode: false }).then((resp) => {
    if (resp.status === 200) {
      const parser = new DOMParser();

      const xml = resp.body;
      const doc = parser.parseFromString(xml, "application/xml") as XMLDocument;

      const items = doc.querySelectorAll("item");

      if (items.length) {
        const episode = Array.from(items)[0];
        const episodeTitle = episode.getElementsByTagName("title")[0].textContent.trim();

        const enclosure = episode.getElementsByTagName("enclosure")[0];
        const enclosureUrl = enclosure.getAttribute("url");
        const enclosureLength = enclosure.getAttribute("length");

        const image = episode.getElementsByTagName("itunes:image")[0];
        const imageUrl = image ? image.getAttribute("href") : null;

        if (title === episodeTitle) {
          expect(title).to.equal(episodeTitle);
          expect(enclosureLength).to.equal("40557");
        }

        cy.request({ url: enclosureUrl, encoding: "binary" }).then((response) => {
          cy.writeFile("test.mp3", response.body, "binary");
          cy.readFile("test.mp3", "base64").then((mp3) => {
            expect(mp3.length).to.equal(54076);
            return;
          });
        });

        if (checkImage) {
          cy.request({ url: imageUrl, encoding: "binary" }).then((response) => {
            cy.writeFile("test.jpg", response.body, "binary");
            cy.readFile("test.jpg", "binary").then((img) => {
              expect(img.length).to.equal(20261);
              return;
            });
          });
        }

        return;
      }
    }

    cy.log("Still waiting for episode to hit RSS feed…");
    cy.wait(Math.min(10000, 2 ** retries * 1000));
    waitForRssItems(url, title, checkImage, (retries += 1));
  });
}

Cypress.Commands.add("waitForRssItems", waitForRssItems);

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      waitForRssItems(
        url: string,
        title: string,
        checkImage: boolean,
        retries: number
      ): Chainable<void>;
    }
  }
}
