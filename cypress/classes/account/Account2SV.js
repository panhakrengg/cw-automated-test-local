import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'

class Account2SV {
  _itcConfirmPassword = new InterceptReq('/account_settings/confirm_password', 'ConfirmPassword')
  _itcGetBackupCodes = new InterceptReq('/account_settings/get_backup_codes', 'GetBackupCodes')

  _itcEnableEmailAuthentication = new InterceptReq(
    '/account_settings/enable_email_authentication',
    'EnableEmailAuthentication'
  )
  getTwoStepVerificationUrl() {
    return '/web/my-profile/account-settings#_accountSettingPortlet_option=two-step-verification'
  }

  verifyIdentityConfirmation(password) {
    cy.getPopup()
      .should('be.visible')
      .within(($popup) => {
        cy.wrap($popup).checkPopupHeader('Identity confirmation')
        cy.wrap($popup)
          .getPopupBody()
          .within(() => {
            cy.get('input').should('have.attr', 'type', 'password').type(password, { log: false })
          })
        cy.wrap($popup)
          .getPopupFooter()
          .within(() => {
            this._itcConfirmPassword.set()
            cy.get(`button:contains("Confirm")`).click()
            this._itcConfirmPassword.wait()
          })
      })
  }

  openBackupCodePopup() {
    cy.getPopup()
      .should('be.visible')
      .within(($popup) => {
        cy.wrap($popup).checkPopupHeader('Save your backup codes')
      })
      .as('backupCodesPopup')
  }

  deleteBackupCodesIfExists(password) {
    cy.get('.cec-card').contains('Backup Codes').parentsUntil('.cec-card').as('cecCard')
    cy.get('@cecCard').then(($card) => {
      if ($card.find('a.btn.link-icon').length) {
        cy.wrap($card).find('a.btn.link-icon').click()
        this.verifyIdentityConfirmation(password)
        cy.loadingOverlayCompleted()
      }
    })
  }

  expectedBackupCodePopupOpens(password) {
    cy.clickButtonByName('Get Codes')
    cy.get('body').within(($body) => {
      try {
        expect($body).to.contain.text('Identity confirmation')
        this.verifyIdentityConfirmation(password)
        cy.wait(5000)
        this.openBackupCodePopup()
      } catch (e) {
        this.openBackupCodePopup()
      }
    })
  }

  expectedValidPopupTitleAndDescription() {
    cy.get('@backupCodesPopup').within(($popup) => {
      cy.wrap($popup)
        .getPopupHeader()
        .within(() => {
          cy.get('span').should('contain.text', 'Save your backup codes')
        })
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          cy.get('div').should(
            'contain.text',
            'Keep these backup codes somewhere safe but accessible.'
          )
        })
    })
  }

  expectedValidGeneratedBackupCodes() {
    this._itcGetBackupCodes.set()
    this._itcGetBackupCodes.getResponse().then(() => {
      cy.get('@backupCodesPopup').within(($popup) => {
        cy.wrap($popup)
          .getPopupBody()
          .within(() => {
            cy.get('div.pb-4')
              .should('have.length.gte', 10)
              .each(($elem) => {
                cy.wrap($elem)
                  .invoke('text')
                  .then(($text) => {
                    const code = $text.trim()
                    expect(code).to.match(/\d+?/)
                    expect(code).to.have.length(6)
                  })
              })
          })
      })
    })
  }

  expectedBackupCodeNoteExists() {
    cy.get('@backupCodesPopup').within(($popup) => {
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          cy.get('div').should(
            'contain.text',
            'Keep these backup codes somewhere safe but accessible.'
          )
        })
    })
  }

  expectedBackupCodeDownloadButtonIsEnabled() {
    cy.get('@backupCodesPopup').within(($popup) => {
      cy.wrap($popup)
        .getPopupFooter()
        .within(() => {
          cy.get('button.btn-primary').should('contain.text', Field.DOWNLOAD).should('be.enabled')
        })
    })
  }

  expectedGetCodesButtonExistsAfterClosePopup() {
    cy.get('@backupCodesPopup').closePopup()
    cy.get(`button:contains("Get Codes")`).should('exist')
  }

  expectedTwoStepVerificationIsEnabled() {
    cy.get('.cec-card strong')
      .contains('2-Step Verification')
      .parentsUntil('.cec-card')
      .should('contain.text', 'Enabled')
  }

  expectedAuthenticatorSectionIsValid(sectionData) {
    this.assert2SVSectionIsValid(sectionData.authenticatorAppSection)
  }

  expectedEmailVerificationSectionIsValid(sectionData) {
    this.assert2SVSectionIsValid(sectionData.emailVerificationSection)
  }

  expectedBackupCodesSectionIsValid(sectionData) {
    this.assert2SVSectionIsValid(sectionData.backupCodesSection)
  }

  assert2SVSectionIsValid(sectionData) {
    cy.get('.cec-card strong.text-black')
      .contains(sectionData.title)
      .parentsUntil('.cec-card')
      .then(($card) => {
        expect($card).to.contain.text(sectionData.title)
        expect($card).to.contain.text(sectionData.description)

        expect($card.find('svg + strong'))
          .to.have.class('text-black')
          .and.contain.text(sectionData.title)

        expect($card.find('a.btn.link-icon > svg')).to.have.length.gt(0)
      })
  }

  expectedSetupEmailAuthenticationVerified(password, itcFetch2StepVerification) {
    this.getEmailVerificationCard().then(($card) => {
      cy.wrap($card).find('.btn-outline-primary').click()
      this.verifyIdentityConfirmation(password)

      cy.swal2()
        .getSwal2ActionButton()
        .then(($actionButtons) => {
          this._itcEnableEmailAuthentication.set()
          cy.wrap($actionButtons).first().click()
          this._itcEnableEmailAuthentication.wait()
        })

      itcFetch2StepVerification.set()
      itcFetch2StepVerification.wait()

      this.expectedTwoStepVerificationIsEnabled()
      this.getEmailVerificationCard().then(($card) => {
        expect($card.find('a.btn.link-icon > svg')).to.have.length.gt(0)
      })
    })
  }

  deleteEmailAuthenticationMethod(password) {
    this.getEmailVerificationCard().then(($card) => {
      cy.wrap($card).find('a.btn.link-icon').click()
      this.verifyIdentityConfirmation(password)
      cy.loadingOverlayCompleted()
    })
  }

  getEmailVerificationCard() {
    return cy.get('.cec-card').contains('Email Verification').parentsUntil('.cec-card')
  }
}
export default Account2SV
