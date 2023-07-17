import InterceptAction from '../base/InterceptAction'
import InterceptReq from '../base/InterceptReq'
import Credentials from '../constants/Credentials'
import Field from '../constants/Field'
import ConfirmChangeEmail from '../notification/email/ConfirmChangeEmail'
import EmailHelper from '../utilities/EmailHelper'

class Account {
  _changePasswordUrl = ''
  _fixturesLocation = 'cypress/fixtures/'

  _itcConfirmPassword = new InterceptReq('/account_settings/confirm_password', 'ConfirmPassword')
  _itcGetBackupCodes = new InterceptReq('/account_settings/get_backup_codes', 'GetBackupCodes')
  _itcFetchAccountSettings = new InterceptReq('/account_settings/fetch', 'FetchAccountSettings')
  _itcModifyAccountSettings = new InterceptReq('/account_settings/modify', 'ModifyAccountSettings')
  _itcSendEmailForgotPwd = new InterceptAction(
    '/auth/forgot_password_link/send_email',
    'SendEmailForgotPwd'
  )
  getAccountSettingUrl() {
    return '/web/my-profile/account-settings'
  }
  visitResetPassword() {
    cy.visit('/forgot-password')
  }
  setChangePasswordUrl(url) {
    this._changePasswordUrl = url
  }
  getChangePasswordUrl() {
    return this._changePasswordUrl
  }
  visitAccountSettings() {
    this._itcFetchAccountSettings.set()
    cy.visit(this.getAccountSettingUrl())
    this._itcFetchAccountSettings.wait()
    cy.waitLoadingOverlayNotExist()
    this.initGeneralSettingSelect()
  }
  initGeneralSettingSelect() {
    cy.get('.general-settings-holder .border-bottom select').first().as('selectLanguage')
  }
  selectLanguageAndSave(lang = 'en_US') {
    cy.waitLoadingOverlayNotExist()
    cy.get('@selectLanguage')
      .select(lang)
      .should('have.value', lang)
      .then(($select) => {
        cy.wrap($select).parents('.cec-p-6').as('selectWrapper')
      })

    cy.get('@selectWrapper').find('.btn-primary').as('saveButton')

    this._itcModifyAccountSettings.set()
    cy.get('@saveButton').click()
    this._itcModifyAccountSettings.wait()
  }

  expectedAvatarMenuItemsChanged(menuData) {
    cy.get('#avatar-dropdown')
      .should('be.visible')
      .then(($content) => {
        cy.wrap($content)
          .click()
          .then(($menuItems = getMenuItems($content)) => {
            this.assertMenuItemsShouldContain($menuItems, menuData)
          })
      })
  }

  expectedAccountSettingsMenuItemsChanged(menuData) {
    cy.get('.learning-wrapper .cw-dropdown')
      .click()
      .then(($menuItems = getMenuItems($content)) => {
        this.assertMenuItemsShouldContain($menuItems, menuData)
      })
  }

  getMenuItems($content) {
    cy.wrap($content)
      .find('ul > li')
      .should('have.length.gte', 5)
      .then(($menuItems) => {
        return $menuItems
      })
    return ''
  }

  assertMenuItemsShouldContain($menuItems, menuData) {
    const $menuKeys = Cypress._.keys(menuData)
    Cypress._.each($menuKeys, (key) => {
      cy.wrap($menuItems).should('contain', menuData[key])
    })
  }

  getPasswordFields() {
    cy.get('.general-settings-holder .border-bottom')
      .eq(2)
      .should('be.visible')
      .as('generalSettingsHolder')

    cy.get('@generalSettingsHolder')
      .within(() => {
        cy.get('input').eq(0).should('have.attr', 'type', 'password').as('currentPassword')
        cy.get('input').eq(1).should('have.attr', 'type', 'password').as('newPassword')
        cy.get('input').eq(2).should('have.attr', 'type', 'password').as('confirmNewPassword')
      })
      .as('accountPasswordHolder')
  }

  expectedShortPasswordError(error) {
    this.typeUserPassword()
    cy.get('@newPassword').type('welcome').blur()
    cy.get('@newPassword')
      .parent()
      .within(() => {
        cy.get('.text-danger').should('contain.text', error)
      })
  }

  expectedWrongPasswordError(error) {
    this.typeUserPassword()
    cy.get('@newPassword').clear().type('welcome').blur()
    cy.get('@newPassword')
      .parent()
      .within(() => {
        cy.get('.text-danger').should('contain.text', error)
      })
  }

  expectedPasswordMustMatchError(error) {
    this.typeUserPassword()
    cy.get('@newPassword').clear().type('Welcome.02')
    cy.get('@confirmNewPassword').type('Welcome.03').blur()
    cy.get('@confirmNewPassword')
      .parent()
      .within(() => {
        cy.get('.text-danger').should('contain.text', error)
      })
  }

  savePassword(currentPassword, newPassword) {
    cy.get('@currentPassword').type(currentPassword)
    cy.get('@newPassword').clear().type(newPassword)
    cy.get('@confirmNewPassword').focus().type(newPassword).blur()
    cy.get('@accountPasswordHolder')
      .should('be.visible')
      .then(($holder) => {
        cy.wrap($holder).find('Button').click()
      })
    cy.waitLoadingOverlayNotExist()
    cy.get('.toast-text').should('contain.text', 'Account password has been saved')
  }

  typeUserPassword() {
    cy.get('@currentPassword').type(Credentials.getPassword())
  }

  expectedCanAccessDashboard() {
    cy.visit('/')
    cy.url().should('contain', '/u/home/dashboard')
  }

  expectedSignInWithWrongPasswordShowErrorMessage(oldPassword, email) {
    cy.signInWith(email, oldPassword)
    cy.get('.kc-feedback-text').should('contain.text', 'Username or password is incorrect.')
  }

  expectedLoginSuccessfully(currentPassword, email) {
    cy.signInWith(email, currentPassword)
    this.expectedCanAccessDashboard()
  }

  getAccountEmailField() {
    cy.getElementWithLabel(`Account Email`, 'h1').parent().as('accountEmailHolder')
  }

  expectedAbleToSeeAccountEmail() {
    cy.get('@accountEmailHolder').should('contain.text', 'Account Email')
  }

  expectedAbleToSeeCurrentUseOfAccountEmail(email) {
    cy.get('@accountEmailHolder').should('contain.text', email)
  }

  expectedInvalidEmailShowErrorMessage(invalidEmail, error) {
    cy.get('@accountEmailHolder').within(() => {
      cy.get('input').type(invalidEmail).blur()
      cy.get('.text-danger').should('contain.text', error)
    })
  }

  expectedTitleAndDescriptionAreVisible() {
    cy.get('.authentication-contain').should('be.visible').as('authenticationContainer')
    cy.get('@authenticationContainer').within(($content) => {
      cy.wrap($content)
        .should('contain.text', 'Reset password')
        .should(
          'contain.text',
          'Don’t worry! Just fill in your information and we’ll send you a link'
        )
    })
  }

  expectedUsernameFieldShowErrorMessageWhenEmpty() {
    cy.get('@authenticationContainer').within(() => {
      cy.get('input').focus().blur()
      cy.getValidationError('This field is required.')
    })
  }

  expectedBackToSignInGoesToLoginScreen() {
    Cypress.on('uncaught:exception', () => false)
    cy.get('@authenticationContainer').within(() => {
      cy.contains('a.text-black', 'Back to Sign in')
        .should('be.visible')
        .click()
        .then(() => {
          cy.url().should('contain', '/login-actions/authenticate')
        })
    })
  }

  inputNewEmailAddress(email) {
    cy.get('label:contains("New email address") + input').type(email).blur()
  }

  clickSaveChangeNewEmailAddress() {
    cy.getElementWithLabel('Account Email', 'h1')
      .parent()
      .within(() => {
        cy.clickButtonByName(Field.SAVE)
      })
  }
  verifyCurrentAccountEmail(email) {
    cy.getElementWithLabel(`Account Email`, 'h1')
      .parent()
      .within(() => {
        cy.getElementWithLabel(`Your account email is`).should('be.visible')
        cy.getElementWithLabel(email).should('be.visible')
      })
  }
  verifyVerificationEmailUI(oldEmail, newEmail) {
    cy.getElementWithLabel(`Account Email`, 'h1')
      .parent()
      .within(() => {
        cy.getElementWithLabel(`Account Email`).should('be.visible')
        cy.getElementWithLabel(`Your account email is`).should('be.visible')
        cy.getElementWithLabel(oldEmail).should('be.visible')
        cy.getElementWithLabel(`Update pending verification`).should('be.visible')
        cy.getElementWithLabel(`We just send you verification code to your email`).should(
          'be.visible'
        )
        cy.getElementWithLabel(newEmail).should('be.visible')
        cy.getElementWithLabel(`and to verify that the new email is yours.`).should('be.visible')
        cy.getElementWithLabel(`Please enter the code`).should('be.visible')
        cy.getElementWithLabel(`Didn't get it?`).should('be.visible')
        cy.getElementWithLabel(`Resend`).should('be.visible')
      })
  }

  getVerificationCodeToChangeEmail(email) {
    const emailHelper = new EmailHelper()
    emailHelper
      .getReceivedEmail(ConfirmChangeEmail.CONFIRM_CHANGE_EMAIL_SUBJECT, email, true)
      .then(($receiveEmail) => {
        const emailTemplate = new DOMParser().parseFromString($receiveEmail, 'text/html')
        if (emailTemplate.getElementsByTagName('table').length) {
          const emailContent = emailTemplate.getElementsByTagName('table')[0].textContent
          cy.wrap(this.getVerificationCodeFromEmailContent(emailContent)).as('verificationCode')
        }
      })
    return cy.get('@verificationCode')
  }
  getVerificationCodeFromEmailContent(emailContent) {
    return emailContent.replace(/[^0-9]/g, '')
  }
  inputChangeEmailVerificationCode(code) {
    cy.getElementWithLabel('Please enter the code')
      .last()
      .should('be.visible')
      .siblings('input')
      .type(code)
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

  clickButtonSaveGeneralInGeneralSetting() {
    cy.getElementWithLabel('General', 'h1')
      .parent()
      .within(() => {
        cy.clickButtonByName(Field.SAVE)
      })
  }

  expectedResetPasswordFieldSubmitted(email) {
    Cypress.on('uncaught:exception', () => false)
    cy.get('.authentication-contain').should('be.visible').as('authenticationContainer')
    cy.get('@authenticationContainer').within(($content) => {
      cy.wrap($content).should('contain.text', 'Reset password')
      cy.get('input#_resetPasswordPortlet_email').type(email).blur()
      cy.get(`button:contains("Send link to my email")`).should('be.enabled').click()
    })
  }

  expectedResetYourPasswordEmailWithLink(objAuEResetPassword) {
    new EmailHelper()
      .getReceivedEmail('Reset Your Password', objAuEResetPassword, true)
      .getEmailElementHref(new RegExp(`Reset\\W+Password`))
    cy.get('@elementHref').then((url) => {
      this.setChangePasswordUrl(url)
      cy.visit(url)
      cy.url().should('contain', '/forgot-password?p_p_id=resetPasswordPortlet')
    })
  }

  expectedPasswordChanged(email) {
    cy.get('.authentication-contain').within(() => {
      cy.get('span').should('contain.text', 'Change password')
      cy.get('input').eq(0).should('have.attr', 'type', 'password').type(email).blur()
      cy.get('input').eq(1).should('have.attr', 'type', 'password').type(email).blur()
      cy.get(`button:contains("Change password")`).should('be.enabled').click()
      cy.get('span').should('contain.text', 'Password changed')
    })
  }

  expectedFillInNonCwEmailAndSendLinkToEmail(invalidEmail) {
    Cypress.on('uncaught:exception', () => false)
    cy.get('.authentication-contain').should('be.visible').as('authenticationContainer')
    cy.get('@authenticationContainer').within(($content) => {
      cy.wrap($content).should('contain.text', 'Reset password')
      cy.get('input').type(invalidEmail).blur()
      cy.get(`button:contains("Send link to my email")`).should('be.enabled').click()
    })
    cy.get('@authenticationContainer').within(() => {
      this._itcSendEmailForgotPwd.set()
      cy.get('a.resend-link').should('contain.text', 'resend a new link').click()
      this._itcSendEmailForgotPwd.wait()
    })
  }

  expectedResetPasswordEmailNotArrive(objInvalidResetPassword) {
    new EmailHelper()
      .getReceivedEmailBySubjectCount('Reset Your Password', objInvalidResetPassword, true)
      .then(($getReceivedEmail) => {
        expect($getReceivedEmail).to.be.null
      })
  }

  expectedToSeePreferredDomainWith(domains = []) {
    cy.expectElementWithLabelVisible('Preferred Domain', 'label')
      .parent()
      .within(() => {
        domains.forEach((domain) => {
          cy.getSelectOptionWith(domain).should('be.visible')
        })
      })
  }

  resetLanguageToEn() {
    cy.get('@selectLanguage').within(($selectLanguage) => {
      cy.wrap($selectLanguage)
        .get('option:selected')
        .invoke('val')
        .then((selectedVal) => {
          if (selectedVal.includes('pt_BR')) {
            this.selectLanguageAndSave()
          }
        })
    })
  }

  changeEmail(previousEmail, newEmail, screenName) {
    const LOGIN_PATH = Cypress.env('loginPath')

    cy.signInViaEmail(previousEmail, screenName)
    cy.location('pathname').then(($pathName) => {
      if ($pathName != LOGIN_PATH) {
        this.visitAccountSettings()
        this.inputNewEmailAddress(newEmail)
        this.clickSaveChangeNewEmailAddress()
        this.getVerificationCodeToChangeEmail(newEmail).then(($verifyCode) => {
          this.inputChangeEmailVerificationCode($verifyCode)
          cy.clickButtonByName(Field.CONFIRM)
        })
        cy.waitLoadingOverlayNotExist()
        cy.reload()
      }
    })
  }
}
export default Account
