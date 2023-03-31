describe("Publish", () => {
  it("creates an episode and publishes it to a feed", () => {
    cy.visit(`https://${Cypress.env("ID_HOST")}/`);
    cy.contains("Sign in");
    cy.get("#login").type(Cypress.env("PUBLISH_USER"));
    cy.get("#password").type(Cypress.env("PUBLISH_PASS"));
    cy.get(".btn.submit").click();

    cy.contains("Welcome, test test");

    const now = new Date().toISOString();

    cy.visit(`https://${Cypress.env("PUBLISH_HOST")}/`);
    cy.get('a[href="/series/new"]').click();
    cy.get("#title").type(`Acceptance Test: ${now}`);
    cy.get("#shortDescription").type(`Acceptance Test: ${now}`);
    // cy.get('prx-button[green=1] button.green').click();

    // cy.wait(4000)
    // cy.url().then((url) => {
    //   const seriesId = url.split('/').at(-1);
    //   cy.log(seriesId);
    // });
  });
});
