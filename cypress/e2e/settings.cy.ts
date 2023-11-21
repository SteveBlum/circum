describe("Settings popup", () => {
    beforeEach(() => {
        cy.visit("http://localhost:8080");
        cy.get("#mainMenuButton").click();
        cy.get("#settingsButton").click();
        cy.get("#settings").should("be.visible");
    });
    describe("Settings Menu", () => {
        it("Default values should be pre-selected", () => {
            cy.get("#refreshRate").contains("600");
            cy.get("#rotationRate").contains("60");
        });
        it("Changing refresh Rate should change the value", () => {
            cy.get('input[id="refreshRateSlider"').invoke("val", 610).trigger("input");
            cy.get("#refreshRate").contains("610");
        });
        it("Changing rotation Rate should change the value", () => {
            cy.get('input[id="rotationRateSlider"]').invoke("val", 70).trigger("input");
            cy.get("#rotationRate").contains("70");
        });
    });
});
