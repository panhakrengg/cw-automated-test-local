import EmailHelper from '../../utilities/EmailHelper'
import Field from '../../constants/Field'

class Consent {
  _consent
  _revokeInfo =
    'This consent requires specific procedures in order to be revoked. Please refer to the consent terms for more details.'
  #emailHelper = new EmailHelper()

  constructor(consent) {
    this._consent = consent
  }

  verifyPreviewConsent(subject) {
    cy.wrap(subject).swal2().getSwal2Content().as('swal2Content')
    cy.get('@swal2Content').within(() => {
      if (this._consent['logoUrl']) {
        cy.get('img.img-64-64.rounded-circle')
          .invoke('attr', 'src')
          .should('contain', this._consent['logoUrl'])
      }
      if (this._consent['headerText']) {
        cy.contains('h1', this._consent['headerText']).should('be.visible')
      }
      if (this._consent['description']) {
        cy.contains('p', this._consent['description']).should('be.visible')
      }
      if (this._consent['linkLabel']) {
        cy.contains('a', this._consent['linkLabel'])
          .invoke('attr', 'href')
          .should('contain', this._consent['linkUrl'])
      }
      this.verifyConsentItems()
    })
    cy.get('@swal2Content').closeSwal2()
  }

  verifyViewConsent() {
    cy.swal2().within(($swal2) => {
      cy.get('.consent-scroll-content').isCheckboxDisabled()
      cy.get('.cec-popup__footer').expectButtonWithLabelAndEnabled(Field.CLOSE)
      cy.wrap($swal2).closeSwal2()
    })
  }

  verifyEditConsent() {
    cy.swal2().within(($swal2) => {
      cy.get('.consent-scroll-content').isCheckboxEnabled()
      cy.get('.cec-popup__footer').expectButtonWithLabelAndDisabled(Field.UPDATE)
      cy.wrap($swal2).closeSwal2()
    })
  }

  verifyRevokePopup(enabled) {
    cy.swal2().within(($swal2) => {
      cy.expectButtonWithLabelAndEnabled(enabled ? Field.CLOSE : Field.YES_REVOKE)
      cy.wrap($swal2).closeSwal2()
    })
  }

  verifyConsentItems() {
    if (this._consent['consentItems'] && this._consent['consentItems'].length) {
      cy.get('.popup-consent-form-wrapper').each((el) => {
        expect(this._consent['consentItems']).to.include(el.text().replace(/\s+/g, ' ').trim())
      })
    }
  }

  verifyRevokeConsent(subject) {
    cy.wrap(subject).swal2().getSwal2Content().contains(this._revokeInfo).closeSwal2()
  }

  confirmRevoke(subject) {
    cy.wrap(subject).swal2().swal2Confirm(Field.YES_REVOKE).click()
  }

  expectToSeeConsentPopup(title) {
    cy.getPopup()
      .should('be.visible')
      .within(($popup) => {
        cy.wrap($popup)
          .get('.cec-popup__body > :nth-child(1) > .font-weight-bold')
          .contains(title)
          .should('be.visible')
      })
  }

  expectedNotSendGivenConsentEmail(subject, email) {
    this.#emailHelper.getReceivedEmailBySubjectCount(subject, email, true).should('be.null')
  }

  expectSendRevokeConsentEmail(subject, email) {
    this.#emailHelper.getReceivedEmailBySubjectCount(subject, email, true).then((emails) => {
      expect(emails.length).to.be.least(1)
    })
  }

  expectSendGivenConsentEmail(subject, email) {
    this.#emailHelper.getReceivedEmailBySubjectCount(subject, email, true).then((emails) => {
      expect(emails.length).to.be.least(1)
    })
  }
}

export default Consent
