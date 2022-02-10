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

  //todo: create 3 processes and check if they are correctly sorted
  // it("create, rename and delete 3 processes", () => {
  //   let testProcesses = [
  //     `Test Process #1 - ${Math.random().toString(36).substring(2, 15)}`,
  //     `Test Process #2 - ${Math.random().toString(36).substring(2, 15)}`,
  //     `Test Process #3 - ${Math.random().toString(36).substring(2, 15)}`,
  //   ];
  //   testProcesses.forEach((process) => {
  //     cy.contains("Create new").click();
  //     cy.get("[aria-label=menu]").click();
  //     // cy.wait(1000);
  //     cy.get("[aria-label=rename").click();
  //     //   cy.wait(1000);
  //     cy.get("#rename-process-text-field").type(process);
  //     // close the menu & go home
  //     cy.get("[aria-label=close]").click();
  //     cy.get(`[aria-label="Go to home page"]`).click();
  //   });

  //   //Todo: check if they are sorted correctly when changing sort order
  //   cy.get("[data-test=sort-select]").select("Last modified");
  //   cy.get("[data-test=sort-select]").select("Alphabetically");
  //   cy.get("[data-test=sort-select]").select("Date created");

  //   //delete the processes
  //   testProcesses.forEach((process) => {
  //     cy.get(`[aria-label="Search for process with name"]`).type(process);
  //     cy.wait(1000);
  //     cy.contains(process).click();
  //     cy.get("[aria-label=menu]").click();
  //     cy.contains("Delete process").click();
  //     cy.get("[aria-label=Delete").click();
  //   });
  // });

  it("can create a new process", () => {
    cy.contains("Create new").click();
    cy.get("[data-test=processName]").should(
      "contain.text",
      "Untitled process"
    );
  });

  // NB: Do-not use data-test-ids. Use what a user sees instead.
  const randomHash = Math.random().toString(36).substring(2, 15);
  const newName = `Random process name ${randomHash}`;
  it("can rename the process", () => {
    cy.get("[aria-label=menu]").click();
    cy.wait(1000);
    cy.get("[aria-label=rename").click();
    cy.wait(1000);
    cy.get("#rename-process-text-field").clear().type(newName);
    cy.get("[aria-label=close]").click();
    cy.wait(1000);
    cy.get("[data-test=processName]").should("contain.text", newName);
  });

  it("can give others access to the process", () => {
    cy.get("#shareButton").click();
    cy.wait(1000);
    cy.get(`[aria-label=shortname]`)
      .clear()
      .type("mbmu {enter} {selectall} magos {enter} {selectall} joseg");
    //press the add button
    cy.get("[aria-label=add]").click();
    cy.get("[aria-label=close]").click();
  });

  it("can find that process in the overview-page", () => {
    cy.get(`[aria-label="Go to home page"]`).click();
    cy.get(`[aria-label="All processes"`).click();
    cy.get(`[aria-label="Search for process with name"]`).type(newName);
    cy.wait(2000);
    cy.contains(newName);
  });

  it("can favourite the process", () => {
    cy.get(`[aria-label="Add to favourites"]`).click();
    cy.wait(1000);
  });

  it("can find the process in my-favourites page", () => {
    cy.get(`[aria-label="My favorite processes"]`).click();
    cy.wait(1000);
    cy.contains(newName);
  });

  it("can un-fave the process", () => {
    cy.get(`[aria-label="Remove from favourites"]`).click();
    cy.wait(1000);
    cy.contains(newName).should("not.exist");
  });

  it("can find the process in my-processes page", () => {
    cy.get(`[aria-label="My processes"]`).click();
    cy.wait(1000);
    cy.contains(newName);
  });

  it("can delete the process", () => {
    cy.contains(newName).click();

    //Can cancel the delete
    cy.get("[aria-label=menu]").click();
    cy.contains("Delete").click();
    cy.get("[aria-label=Cancel]").click();

    //Can delete the process
    cy.get("[aria-label=menu]").click();
    cy.contains("Delete").click();
    cy.get("[aria-label=Delete]").click();
  });
});
