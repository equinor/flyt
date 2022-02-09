// process.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe("Managing a process", () => {
  it("loads the frontpage", () => {
    cy.visit("localhost:3000");
  });

  // it("Can order by last modified", () => {
  //   cy.get("[data-test=sort-select]").select("Last modified");
  //   //todo: check the order of the process-cards
  // });
  //
  // it("Can order by alphabetically", () => {
  //   cy.get("[data-test=sort-select]").select("Alphabetically");
  //   //todo: check the order of the process-cards
  // });
  //
  // it("Can order by date created", () => {
  //   cy.get("[data-test=sort-select]").select("Date created");
  //   //todo: check the order of the process-cards
  // });

  it("can create a new process", () => {
    cy.contains("Create new").click();
    cy.get("[data-test=processName]").should(
      "contain.text",
      "Untitled process"
    );
  });

  // todo: Do-not use data-test-ids. Use what a user sees instead.
  const randomHash = Math.random().toString(36).substring(2, 15);
  const newName = `Random process name ${randomHash}`;
  it("can rename the process", () => {
    cy.get("[data-test=processMenuButton]").click();
    cy.wait(1000);
    cy.get("[data-test=renameButton]").click();
    cy.wait(1000);
    cy.get("[data-test=renameInput]").clear().type(newName);
    cy.get("[data-test=renameButtonClose]").click();
    cy.wait(1000);
    cy.get("[data-test=processName]").should("contain.text", newName);
  });

  it("can give others access to the process", () => {
    cy.get("#shareButton").click();
    cy.wait(1000);
    cy.get("[data-test=shareInput]")
      .clear()
      .type("mbmu {enter} {selectall} magos {enter} {selectall} joseg");
    //press the add button
    cy.get("[data-test=shareButtonAdd]").click();
    cy.wait(4000);
    cy.get("[data-test=shareButtonClose]").click();
  });

  it("can find that process in the overview-page", () => {
    cy.get("[data-test=homeButton]").click();
    cy.get("[data-test=searchInput]").type(newName);
    cy.wait(2000);
    cy.contains(newName);
  });

  it("can favourite the process", () => {
    cy.get("[data-test=buttonHeart]").click();
    cy.wait(1000);
  });

  it("can find the process in my-favourites page", () => {
    cy.get("[data-test=myFavoriteProcessesButton]").click();
    cy.wait(1000);
    cy.contains(newName);
  });

  it("can un-fave the process", () => {
    cy.get("[data-test=buttonHeart]").click();
    cy.wait(1000);
    cy.contains(newName).should("not.exist");
  });

  it("can find the process in my-processes page", () => {
    cy.get("[data-test=myProcessesButton]").click();
    cy.wait(1000);
    cy.contains(newName);
  });

  it("can delete the process", () => {
    cy.contains(newName).click();

    //Can cancel the delete
    cy.get("[data-test=processMenuButton]").click();
    cy.get("[data-test=deleteButton]").click();
    cy.get("[data-test=deleteButtonCancel]").click();

    //Can delete the process
    cy.get("[data-test=processMenuButton]").click();
    cy.get("[data-test=deleteButton]").click();
    cy.get("[data-test=deleteButtonApprove]").click();
  });
});
