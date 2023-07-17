import Discussion from '../../constants/Discussion'
import BaseDiscussion from './BaseDiscussion'
import InterceptDiscussion from './InterceptDiscussion'

class MoveThreadPopUp extends BaseDiscussion {
  /* Actions */
  clickMoveThreeDot() {
    InterceptDiscussion.itcFetchCategory.set()
    super.selectThreadThreeDotBy(Discussion.MOVE)
    InterceptDiscussion.itcFetchCategory.wait()
  }

  selectCategory(categoryName) {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).clickVueTreeSelect()
      cy.wrap($swal2).clickVueTreeSelectOption(categoryName)
    })
  }

  clickMoveCategoryButton() {
    InterceptDiscussion.itcMoveThread.set()
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).btnConfirm(Discussion.MOVE).click()
    })
    InterceptDiscussion.itcMoveThread.wait()
  }

  /* Assertions */
  verifyMoveThreadPopUp(treeSelectItems = []) {
    cy.swal2().within(($swal2) => {
      cy.getSwal2Header().should('have.text', Discussion.MOVE_THREAD_TITLE)
      cy.getSwal2Content().within(($content) => {
        cy.wrap($content).as('swal2Content')
        cy.wrap($content).should('contain.text', 'Current Category: Uncategorised')
        cy.wrap($content).should('contain.text', 'Move To')
        cy.wrap($content).clickVueTreeSelect()
        this._verifyCategoriesDropdown(treeSelectItems)
      })
      cy.wrap($swal2).closeSwal2()
    })
  }

  _verifyCategoriesDropdown(treeSelectItems = []) {
    cy.get('@swal2Content').within(($content) => {
      cy.wrap($content)
        .getVueTreeSelectOptions()
        .each((item) => {
          cy.wrap(item).within(($item) => {
            cy.wrap($item)
              .get('.vue-treeselect__label')
              .invoke('text')
              .then(($text) => {
                expect(treeSelectItems).to.include($text)
              })
          })
        })
    })
  }
  verifyShowAlertSuccess() {
    cy.getElementWithLabel('Successfully Moved!', '.alert-success').should('exist')
  }
}

export default MoveThreadPopUp
