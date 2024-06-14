describe("Feeder Episode Planner", () => {
  beforeEach(() => {
    cy.login(Cypress.env("TEST_PRX_USER"), Cypress.env("TEST_PRX_PASS"));
    Cypress.config({ baseUrl: `https://${Cypress.env("FEEDER_HOST")}` });
  });

  it ("builds episode drafts in bulk", () => {
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

    // plan episodes
    cy.contains("a", "Plan Episodes").click();
    cy.get("#selected_days").select(["Sunday", "Monday"], {force: true});
    cy.get("#selected_weeks").select("First Week", {force: true});
    cy.get("#ad_breaks").type("1");
    cy.contains("Create 10 Drafts").click();
    cy.contains("Episode drafts generated");

    // check for drafts
    cy.get(".episode-card").should("have.length", 10);
    cy.get(".prx-badge-incomplete").should("have.length", 10);
    cy.contains("a", "Plan Episodes").click();
    cy.get("td[class*='bg-warning']").should("have.length", 10);
    cy.get("#selected_days").select("Sunday", {force: true});
    cy.get("#selected_weeks").select("First Week", {force: true});
    cy.get("td[class*='bg-danger']").should("have.length", 5);

    // go back to podcast settings and delete
    cy.contains("a", "Settings").click({ force: true });
    cy.get("#podcast_title");
    cy.contains(".btn", "Save").next(".dropdown-toggle").click();
    cy.contains(".dropdown-item", "Delete").click();
    cy.contains("Really Delete?");
    cy.contains(".btn", "Delete").click();
    cy.contains("Podcast deleted");
  });
})
