describe("Feeder Custom Feed", () => {
  beforeEach(() => {
    cy.login(Cypress.env("TEST_PRX_USER"), Cypress.env("TEST_PRX_PASS"));
    Cypress.config({ baseUrl: `https://${Cypress.env("FEEDER_HOST")}` });
  });

  it("creates a new custom feed", () => {
    const now = new Date().toISOString();
    const canary = `Acceptance Test: ${now}`;

    cy.visit("/podcasts");
    cy.contains("My Podcasts");

    // create a new podcast
    cy.get('a.btn-success[href="/podcasts/new"]').click();
    cy.contains("New Podcast");
    cy.get("#podcast_title").type(canary);
    cy.get("#podcast_default_feed_attributes_itunes_category").select("Business", { force: true });
    cy.get("#podcast_default_feed_attributes_itunes_subcategory").select("Careers", {
      force: true,
    });
    cy.contains(".btn", "Create").click();
    cy.contains("Podcast created");

    // go to feeds and add a new custom feed
    cy.contains("a", "Feeds").click();
    cy.contains(".btn", "Add a Feed").click();
    cy.get("#feed_label").type(canary);
    cy.get("#feed_slug").type("customslug");
    cy.contains(".btn", "Create").click();
    cy.contains("Feed created");

    // update and make it a private feed
    cy.get("#feed_private").click();
    cy.contains(".btn", "Add Token").click();
    cy.get("[id^=feed_feed_tokens]").first().type("newtoken");
    cy.contains(".btn", "Save").click();
    cy.contains("Feed updated");

    // delete the custom feed
    cy.contains(".btn", "Save").next(".dropdown-toggle").click();
    cy.contains(".dropdown-item", "Delete").click();
    cy.contains("Really Delete?");
    cy.contains(".btn", "Delete").click();
    cy.contains("Feed deleted");

    // go back to podcast settings and delete
    cy.contains("a", "Settings").click({ force: true });
    cy.get("#podcast_title");
    cy.contains(".btn", "Save").next(".dropdown-toggle").click();
    cy.contains(".dropdown-item", "Delete").click();
    cy.contains("Really Delete?");
    cy.contains(".btn", "Delete").click();
    cy.contains("Podcast deleted");
  });
});
