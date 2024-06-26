describe("Augury", () => {
  beforeEach(() => {
    cy.login(Cypress.env("TEST_PRX_USER"), Cypress.env("TEST_PRX_PASS"));
    Cypress.config({ baseUrl: `https://${Cypress.env("AUGURY_HOST")}` });
  });

  it("find and update a series", () => {
    const now = new Date().toISOString();
    const canary = `Acceptance Test: ${now}`;

    cy.visit("/inventory");
    cy.contains("Series");
    cy.contains("Acceptance Test Series").click();
    cy.get("#inventory_notes").clear();
    cy.get("#inventory_notes").type(`Inventory Notes: ${canary}`);
    cy.contains(".btn", "Update Series").click();
    cy.contains("Series successfully updated");
  });

  it("creates and deletes campaigns and flights", () => {
    const now = new Date().toISOString();
    const canary = `Acceptance Test: ${now}`;

    cy.visit("/flights");
    cy.contains("Flights");

    // create a new campaign
    cy.get('a.btn-success[href="/campaigns/new"]').click();
    cy.contains("New Campaign");
    cy.get("#campaign_name").type(`Campaign ${canary}`);
    cy.get("label[for=campaign_advertiser_id").prev().click();
    cy.intercept("/options/advertisers?q=a").as("advertiserList");
    cy.get("input:focus").type("a");
    cy.wait("@advertiserList");
    cy.get("input:focus").type("{downArrow}{downArrow}{downArrow}{enter}");
    cy.contains(".btn", "Create Campaign").click();
    cy.get("h2").contains(`Campaign ${canary}`);

    // add a flight
    cy.contains(".btn", "Add Flight").click();
    cy.get("#flight_name").type(`Flight ${canary}`);
    cy.get("#flight_start_at").type(now);
    cy.get("#flight_start_at").blur();
    cy.get("label[for=flight_inventory_id").prev().click();
    cy.get("div:focus").type("{downArrow}{downArrow}{enter}");
    cy.contains(".btn", "Create Flight").click();
    cy.get("h2").contains(`Flight ${canary}`);

    // delete campaing
    cy.get("#campaign-tab").click();
    cy.contains("Advertiser");
    cy.get("#campaign-context").click();
    cy.get("a[data-bs-target='#delete-campaign-modal']").click();
    cy.get("button.btn-danger").contains("Delete Campaign").click();
  });

  it("creates flights and calculates inventory?", () => {
    // TODO
  });

  it("creates and deletes creatives", () => {
    // const now = new Date().toISOString();
    // const canary = `Acceptance Test: ${now}`;
    // const audioFile = "cypress/samples/two-tone.mp3";
    // cy.visit("/creatives");
    // cy.contains("h1", "Creatives");
    // create creative
    // cy.get("a.btn-success[href='/creatives/new']").click();
    // cy.get("#creative_filename").type(`Creative ${canary}`);
    // cy.get(".uploader-container").get("input[type=file]").selectFile(audioFile, { force: true });
    // cy.get("#creative_account_id").next().type("{downArrow}{downArrow}{enter}");
    // cy.intercept("/options/advertisers?q=a").as("advertiserList");
    // cy.get("#creative_advertiser_id").next().type("a");
    // cy.wait("@advertiserList");
    // cy.get("input:focus").type("{downArrow}{enter}");
    // cy.contains("Create Creative").click();
    // cy.contains("Creative was successfully created");
    // delete creative
    // cy.get("[id^=creative-context-]").click();
    // cy.contains("Delete Creative").click();
    // cy.contains("button.btn-danger", "Delete Creative").click();
    // cy.contains("Creative deleted");
  });
});
