import ItemLearningPathBase from './ItemLearningPathBase'

class ItemLearningPathAssertion extends ItemLearningPathBase {
  expectButtonDisable() {
    cy.contains('Update learning path').buttonDisabled()
  }
  verifySideBar() {
    this.getSideBar().should('contain', 'Learning Path Overview')
    this.getSideBar().should('contain', 'Edit Learning Path')
    this.getSideBar().should('contain', 'Courses')
    this.getSideBar().should('contain', 'Members')
    this.getSideBar().should('contain', 'Change Log')
  }
}
export default ItemLearningPathAssertion
