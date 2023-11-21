describe("Main Screen", () => {
    beforeEach(() => {
        cy.visit("http://localhost:8080");
    });
    describe("General Tests", () => {
        it("Navigation button exist", () => {
            cy.get(".carousel-control-prev");
            cy.get(".carousel-control-next");
        });
        it("Menu button exists", () => {
            cy.get("#mainMenuButton").should("have.class", "dropdown-toggle");
        });
    });
    describe("iFrames", () => {
        it("The first of the iFrames is active", () => {
            cy.get("#0FrameDiv").should("have.class", "active");
        });
    });
    describe("Menu", () => {
        it("Should not appear be default", () => {
            cy.get("#mainMenu").should("not.be.visible");
            cy.get("#fullscreenButton").should("not.be.visible");
            cy.get("#refreshNowButton").should("not.be.visible");
            cy.get("#settingsButton").should("not.be.visible");
            cy.get("#settings").should("not.be.visible");
        });
        it("Should appear if menu button was clicked", () => {
            cy.get("#mainMenuButton").click();
            cy.get("#mainMenu").should("be.visible");
        });
        describe("Settings Menu", () => {
            it("Should open when settings button is clicked", () => {
                cy.get("#mainMenuButton").click();
                cy.get("#settingsButton").click();
                cy.get("#settings").should("be.visible");
            });
        });
    });
});
