import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'

class SetupCompleteActivity {
  #itcMarkAsCompleted = new InterceptReq('/course_activity/mark_as_completed', 'MarkAsCompleted')

  completeHyperlink(name, index = 0) {
    this.#itcMarkAsCompleted.set()
    cy.getElementWithLabel(name, '.item-re-order')
      .eq(index)
      .within((item) => {
        cy.wrap(item).click()
        cy.wrap(item).clickLinkByName('Enter Link')
      })
    cy.swal2().within(() => {
      cy.clickButtonByName(Field.CONTINUE)
    })
    this.#itcMarkAsCompleted.wait()
  }

  addCertificateToProfile() {
    cy.clickLinkByName('Show this certificate on my profile')
    cy.swal2().within(() => {
      cy.clickButtonByName('Yes, Show')
    })
    cy.expectElementWithLabelVisible('Already shown on your profile', 'div')
  }
}
export default SetupCompleteActivity
