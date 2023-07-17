import { ConsentPopupButton } from '../ConsentConstant'

class BaseConsentPopup {
  #consentBaseYaml

  setConsent(baseYaml) {
    this.#consentBaseYaml = baseYaml
  }

  expectToSeeBody() {
    const consentItems = this.#consentBaseYaml.consentItems
    cy.get('@popup')
      .getPopupBody()
      .within(() => {
        cy.expectElementWithLabelVisible(this.#consentBaseYaml.name, '.font-weight-bold')
        cy.expectElementWithLabelVisible(this.#consentBaseYaml.description, 'p')

        for (const itemKey in consentItems) {
          cy.getElementWithLabel(consentItems[`${itemKey}`].desc, 'label').within(() => {
            cy.isUnchecked()
            cy.expectElementWithLabelVisible(consentItems[`${itemKey}`].desc, 'p')
            consentItems[`${itemKey}`].optional
              ? cy.expectElementWithLabelVisible('(Optional)', '.font-italic.text-gray')
              : cy.expectElementWithLabelNotExist('(Optional)', '.font-italic.text-gray')
          })
        }
      })
  }

  expectToSeeFooter() {
    cy.get('@popup').getPopupFooter().should('contain.text', ConsentPopupButton.YES_I_AGREE)
  }
}
export default BaseConsentPopup
