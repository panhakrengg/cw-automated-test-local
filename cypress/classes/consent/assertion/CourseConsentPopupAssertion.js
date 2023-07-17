import Environment from '../../base/Environment'
import BaseConsentPopup from '../base-consent/BaseConsentPopup'
import { ConsentHeaderPopup } from '../ConsentConstant'

class CourseConsentPopupAssertion extends BaseConsentPopup {
  #expectHeader() {
    cy.get('@popup')
      .getPopupHeader()
      .within(() => {
        cy.expectElementWithLabelVisible(ConsentHeaderPopup.PREDEFINED_CONSENT, 'p')
        cy.imageSourceInclude(`${new Environment()._baseUrl}/documents/`)
        cy.hasSvgIcon()
      })
  }

  expectPredefinedConsentPopup() {
    cy.getPopup().as('popup')
    this.#expectHeader()
    this.expectToSeeBody()
    this.expectToSeeFooter()
  }
}
export default CourseConsentPopupAssertion
