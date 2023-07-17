import Discussion from '../../constants/Discussion'
import Field from '../../constants/Field'

class RemoveThreadPopUp {
  /* Actions */
  clickConfirm() {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).swal2Confirm(Field.YES_REMOVE).click()
    })
  }

  /* Assertions */
  verifyRemoveThreadPopUp() {
    cy.swal2().within(($swal2) => {
      cy.getSwal2Header().should('have.text', Discussion.REMOVE_THREAD_TITLE)
      cy.getSwal2Content().should('contain.text', Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE)
      cy.getSwal2ActionButton().should('contain.text', Field.YES_REMOVE)
      cy.wrap($swal2).closeSwal2()
    })
  }
}

export default RemoveThreadPopUp
