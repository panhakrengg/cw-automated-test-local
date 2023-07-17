import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'

class SetupAcceptConsent {
  acceptAllItems() {
    cy.get('.cec-popup__body .row').each((popup) => {
      cy.wrap(popup).within(() => {
        cy.getCheckbox().check()
      })
    })
  }
  acceptButExceptOptionalItem() {
    cy.get('.cec-popup__body .row').each(($row) => {
      cy.wrap($row)
        .invoke('text')
        .then((text) => {
          if (!text.includes('Optional')) cy.wrap($row).within(() => cy.getCheckbox().check())
        })
    })
  }

  clickYesIAgreeCourse() {
    Itc.fetchConsentForm.set()
    cy.clickPrimaryButton(Field.YES_I_AGREE)
    Itc.fetchConsentForm.wait()
    cy.wait(2000)
  }
}

class Itc {
  static fetchConsentForm = new InterceptReq('/consent_form/fetch', 'FetchConsentForm')
}

export default SetupAcceptConsent
