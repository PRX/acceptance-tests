describe("Publish", () => {
  it("creates an episode and publishes it to a feed", () => {
    const now = new Date().toISOString();
    const canary = `Acceptance Test: ${now}`;

    // Login
    cy.visit(`https://${Cypress.env("ID_HOST")}/`);
    cy.contains("Sign in");
    cy.get("#login").type(Cypress.env("PUBLISH_USER"));
    cy.get("#password").type(Cypress.env("PUBLISH_PASS"));
    cy.get(".btn.submit").click();

    // Confirm login
    cy.contains("Welcome, test test");

    // Create a new series
    cy.visit(`https://${Cypress.env("PUBLISH_HOST")}/`);
    cy.get('a[href="/series/new"]').click();
    cy.get("#title").type(canary);
    cy.get("#shortDescription").type(canary);
    cy.get("prx-button[green=1] button.green").click();

    // Confirm series creation
    // This button shows up once we've moved from /new to the series show page
    cy.get("button.delete").should("exist");

    cy.url().then((seriesUrl) => {
      const seriesId = seriesUrl.split("/").at(-1);

      // Create a podcast for the series
      cy.visit(
        `https://${Cypress.env("PUBLISH_HOST")}/series/${seriesId}/podcast`
      );
      cy.get(
        ".page form prx-fancy-field[label='Series Podcast'] button"
      ).click();
      cy.get("#category").click();
      cy.get("#category .ng-option").first().click();
      cy.get("#explicit").click();
      cy.get("#explicit .ng-option").first().click();
      cy.get("prx-button button").contains("Save").click();

      cy.get("prx-button button").contains("Saved").should("exist");

      cy.get("input[name=publishedUrl]").then((inp) => {
        const feedUrl = inp.val().toString();

        // Create a new episode
        cy.visit(
          `https://${Cypress.env("PUBLISH_HOST")}/story/new/${seriesId}`
        );
        cy.get("prx-modal footer button").contains("Okay").click();
        cy.get("#title").type(canary);
        cy.get("#shortDescription").type(canary);
        cy.get("prx-audio-input input[type=file]").selectFile(
          "cypress/samples/two-tone.mp3",
          { force: true }
        );
        cy.get("publish-story-status select").first().select("published");
        cy.get("button").contains("Publish Now").click();

        // This element exists only once the episode has become published
        cy.get("label[for=editDate]", { timeout: 60000 }).should("exist");

        // Confirm that the episode has been added to the public feed
        cy.waitForRssItems(feedUrl, canary);

        // Unpublish the episode
        cy.get("publish-status-control .dropdown-toggle").click();
        cy.get("publish-status-control button").contains("Unpublish").click();
        cy.get("prx-modal footer button").contains("Okay").click();

        // Once the episode has been unpublished
        cy.get("publish-story-status h2.draft")
          .contains("draft")
          .should("exist");

        // Delete the episode
        cy.get("publish-status-control .dropdown-toggle").click();
        cy.get("publish-status-control button").contains("Delete").click();
        cy.get("prx-modal footer button").contains("Okay").click();

        // Episode is deleted when we return to the podcast index
        cy.get("h2").contains("Your Series").should("exist");

        // Delete the series
        cy.visit(`https://${Cypress.env("PUBLISH_HOST")}/series/${seriesId}`);
        cy.get("button").contains("Delete").click();
        cy.get("prx-modal footer button").contains("Okay").click();
      });
    });
  });
});
