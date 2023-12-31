describe("getAdditionalEditAnnotationComps", function () {
  it("the getAdditionalEditAnnotationComps should allow displaying additional custom components in the annotation edit view!", function () {
    cy.visit("");
    cy.tgToggle("getAdditionalEditAnnotationComps");
    cy.contains(".veRowView text", "Part 0").dblclick();
    cy.contains(`I'm added via the getAdditionalEditAnnotationComps`);
  });
});
