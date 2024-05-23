describe("Feeder RSS Import", () => {
  before(() => {
    cy.login(Cypress.env("TEST_PRX_USER"), Cypress.env("TEST_PRX_PASS"));
    Cypress.config({ baseUrl: `https://${Cypress.env("FEEDER_HOST")}` });
  });

  it("imports an RSS feed", () => {
    const now = new Date().toISOString();
    const canary = `Acceptance Test: ${now}`;

    cy.visit("/podcasts");
    cy.contains("My Podcasts");

    // create a new podcast
    cy.get('a.btn-success[href="/podcasts/new"]').click();
    cy.contains("New Podcast");
    cy.get("#podcast_title").type(canary);
    cy.get("#podcast_default_feed_attributes_itunes_category").select("Arts", { force: true });
    cy.contains(".btn", "Create").click();
    cy.contains("Podcast created");

    // start importing a url
    cy.contains("a", "Import").click();
    cy.get("#podcast_import_url").type("https://ryan-cdn.prxu.org/test-rss-import.xml");
    cy.contains(".btn", "Start Import").click();

    // wait for the import to create episodes
    cy.contains(".badge", "Created", { timeout: 30000 });
    cy.contains(".badge", "Complete", { timeout: 30000 });
    cy.contains("a", "S2 EP2 Glassware").click();
    cy.contains("Published");
    cy.contains("a", "Media Files").click();

    // wait for episode media to process
    cy.contains(".badge", "Complete", { timeout: 30000 });
    cy.contains("00:00:10");

    // go to podcast settings and delete
    cy.contains("a", "Settings").click({ force: true });
    cy.get("#podcast_title");
    cy.contains(".btn", "Save").next(".dropdown-toggle").click();
    cy.contains(".dropdown-item", "Delete").click();
    cy.contains("Really Delete?");
    cy.contains(".btn", "Delete").click();
    cy.contains("Podcast deleted");
  });
});
