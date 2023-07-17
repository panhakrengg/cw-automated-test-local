import Environment from '../../base/Environment'
import BaseConsentPopup from '../base-consent/BaseConsentPopup'
import { CommunityBanner } from '../ConsentConstant'

class CommunityConsentPopupAssertion extends BaseConsentPopup {
  #copName

  setCommunityName(name) {
    this.#copName = name
  }
  #expectHeader() {
    cy.get('@popup')
      .getPopupHeader()
      .within(() => {
        cy.imageSourceInclude(`${new Environment()._baseUrl}/documents/portlet_file_entry/`)
        cy.expectElementWithLabelVisible(this.#copName, 'p')
      })
  }

  #expectThanksForJoiningBanner() {
    cy.get('@popup')
      .find('.information-banner')
      .within(() => {
        cy.hasSvgIcon()
        cy.expectElementWithLabelVisible(CommunityBanner.THANK_YOU_FOR_JOINING, '.font-size-14')
      })
  }

  expectPredefinedConsentPopup() {
    cy.getPopup().as('popup')
    this.#expectHeader()
    // this.#expectThanksForJoiningBanner() TODO: remove this check on production and uat not show
    this.expectToSeeBody()
    this.expectToSeeFooter()
  }
}
export default CommunityConsentPopupAssertion
