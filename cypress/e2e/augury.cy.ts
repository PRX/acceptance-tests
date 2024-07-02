/* global JQuery */

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

  it("checks inventory availability", () => {
    cy.visit("/availability");

    // Functions to be implemented
    cy.getStartDateInput().type("2024-07-01");
    cy.getEndDateInput().type("2024-07-31");
    cy.selectSlimSelect("#inventory_id", "Acceptance Test Series");
    cy.selectSlimSelect("#zone", "House Preroll");

    cy.getAvailabilityResults().should("be.visible");
    cy.getAvailabilityResults().contains("Calculate");
    cy.getAvailabilityResults().click();

    // page should container "Forecasted Inventory"
    cy.contains("Forecasted Inventory");
  });

  it("generates a campaign report", () => {
    // Assuming we have a campaign with ID 1
    cy.visit("/reports");
    cy.contains("Navigate to different types of reports across Dovetail");

    cy.get("#campaign_id + .ss-main").click(); // Open the dropdown
    cy.contains("Search");

    // The dropdown is disconnected/supra of the #campaign_id element
    cy.get(".ss-open-below .ss-search input[type=search]").click({ multiple: true });
    cy.get(".ss-open-below .ss-search input[type=search]").type("C");

    cy.contains("Campaign Acceptance Test");
    cy.get(".ss-open-below .ss-search input[type=search]").type("{downArrow}{enter}");
    cy.get(".ss-open-below .ss-search input[type=search]").click({ multiple: true });

    cy.get("#campaign_id").closest(".card").find(".btn").click();

    cy.contains("Report Builder");
  });
});

declare namespace Cypress {
  interface Chainable<Subject = any> {
    getStartDateInput(): Chainable<JQuery<HTMLElement>>;
    getEndDateInput(): Chainable<JQuery<HTMLElement>>;
    getInventoryTypeSelect(): Chainable<JQuery<HTMLElement>>;
    getAvailabilityResults(): Chainable<JQuery<HTMLElement>>;
    selectSlimSelect(selector: string, value: string): Chainable<JQuery<HTMLElement>>;
  }
}

// Custom commands that can be chained
Cypress.Commands.add("getStartDateInput", () => {
  return cy.get("input#start_date");
});

Cypress.Commands.add("getEndDateInput", () => {
  return cy.get("input#end_date");
});

Cypress.Commands.add("getInventoryTypeSelect", () => {});

Cypress.Commands.add("selectSlimSelect", (selector, value) => {
  cy.get(`${selector} + .ss-main`).click(); // Open the dropdown
  cy.get(".ss-option").contains(value).click(); // Select the option
});

Cypress.Commands.add("getAvailabilityResults", () => {
  cy.get('form.button_to button[type="submit"]');
});
