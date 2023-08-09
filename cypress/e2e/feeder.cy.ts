describe("Feeder", () => {
  before(() => {
    cy.login(Cypress.env("TEST_PRX_USER"), Cypress.env("TEST_PRX_PASS"));
    cy.config({ baseUrl: `https://${Cypress.env("FEEDER_HOST")}` });
  });

  it("creates an episode and publishes it to a feed", () => {
    const now = new Date().toISOString();
    const canary = `Acceptance Test: ${now}`;
    const audioFile = "cypress/samples/two-tone.mp3";
    const imageFile = "cypress/samples/1400.jpg";

    cy.visit("/podcasts");
    cy.contains("My Podcasts");

    // create a new podcast
    cy.get("#podcast-switcher").click();
    cy.get('a[href="/podcasts/new"]').click();
    cy.contains("New Podcast");
    cy.get("#podcast_title").type(canary);
    cy.get("#podcast_itunes_category").select("Business", { force: true });
    cy.get("#podcast_itunes_subcategory").select("Careers", { force: true });
    cy.contains(".btn", "Create").click();
    cy.contains("Podcast created");

    // go to new episodes, dismiss missing drafts warning, if present
    cy.contains("a", "Create Episode").click();
    cy.contains(".btn", "Create Draft");
    cy.get("body").then(($body) => {
      if ($body.find("#missing-drafts").length > 0) {
        cy.get("#missing-drafts .btn").click();
      }
    });

    // add image and create episode
    cy.get("#episode_title").type(canary);
    cy.get("#episode-form-image input[type=file]").selectFile(imageFile, { force: true });
    cy.contains(".btn", "Create Draft").click();
    cy.contains("Episode created");

    // add audio and save
    cy.contains("a", "Media Files").click();
    cy.get("#episode_ad_breaks").type(0);
    cy.get("#episode-form-media input[type=file]").selectFile(audioFile, { force: true });
    cy.contains(".btn", "Save").click();
    cy.contains("Media files updated");

    // wait for file processing, then publish
    cy.get("#episode-form-media .spinner-border", { timeout: 60000 }).should("not.exist");
    cy.get(".prx-tabs-nav a").first().click();
    cy.get("#episode-form-image .spinner-border", { timeout: 5000 }).should("not.exist");
    cy.get("#episode_publishing_status").select("Published", { force: true });
    cy.contains(".btn", "Save").click();
    cy.contains("Episode updated");

    // find the feed url, and wait for item to appear
    // NOTE: header link may be covered by the toast
    cy.contains("a", "Feeds").click({ force: true });
    cy.get("#feed_published_url").then(($input) => {
      const feedUrl = $input.val().toString();
      cy.waitForRssItems(feedUrl, canary, true);
    });

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
