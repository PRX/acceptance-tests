describe("Augury", () => {
  before(() => {
    cy.login(Cypress.env("TEST_PRX_USER"), Cypress.env("TEST_PRX_PASS"));
    Cypress.config({
      baseUrl: `https://${Cypress.env("AUGURY_HOST")}`,
    });
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
    cy.get("label[for=campaign_advertiser_id").prev().click().wait(500);
    cy.get("input:focus").type("a").wait(500).type("{downArrow}{downArrow}{downArrow}{enter}");
    cy.contains(".btn", "Create Campaign").click();
    cy.get("h2").contains(`Campaign ${canary}`);

    // add a flight
    cy.contains(".btn", "Add Flight").click();
    cy.get("#flight_name").type(`Flight ${canary}`);
    cy.get("#flight_start_at").type(now);
    cy.get("#flight_start_at").blur();
    cy.get("label[for=flight_inventory_id").prev().click().wait(500);
    cy.get("div:focus").click().wait(500).type("{downArrow}{downArrow}{enter}");
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

  // TODO Also test creating advertisers? creatives? reports? availability?
});
