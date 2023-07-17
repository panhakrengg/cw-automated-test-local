import Environment from '../base/Environment'
import InterceptAction from '../base/InterceptAction'
import InterceptReq from '../base/InterceptReq'
import Credentials from '../constants/Credentials'
import Field from '../constants/Field'
import EmailVerification from '../org-management/org-structure/EmailVerification'
import EmailHelper from '../utilities/EmailHelper'
import Properties from '../utilities/Properties'

const pwd = Credentials.getPassword()

class SetupAuthentication {
  _emailVerification = 'Email Verification'
  _emailVerificationDes = 'Set up your email to get verification codes.'
  _authenticationApp = 'Authenticator App'
  _authenticationAppDes =
    'Use the Authenticator app to get free verification codes, even when your phone is offline.'
  _backupCode = 'Backup Codes'
  _backupCodeDes =
    '10 single-use codes are active at this time, but you can generate more as needed.'
  _setupAuthenticationPage = '/web/guest/setup-authentication'
  _identityConfirmed = false

  _itcConfirmPassword = new InterceptReq('/account_settings/confirm_password', 'ConfirmPassword')
  _itcEnableEmailAuth = new InterceptReq(
    '/account_settings/enable_email_authentication',
    'EnableEmailAuth'
  )
  _itcFetch2StepVerification = new InterceptReq(
    '/account_settings/two_step_verification/fetch',
    'Fetch2StepVerification'
  )
  _itcDisableEmailAuth = new InterceptReq(
    '/account_settings/disable_email_authentication',
    'DisableEmailAuth'
  )
  _itcDisable2Fa = new InterceptReq('/org_management/account/disable_2fa', 'Disable2Fa')
  _itcFetchAccountSettings = new InterceptReq('/account_settings/fetch', 'FetchAccountSettings')
  _itcRequired2Fa = new InterceptReq('/organization/manage_user/required_2fa', 'Required2Fa')
  _itcConfirmOtpCode = new InterceptReq('/account_settings/confirm_one_time_code', 'ConfirmOtpCode')
  _itcGetOtpAuthUrl = new InterceptReq('/account_settings/get_otp_auth_url', 'GetOtpAuthUrl')
  _itcModify2fa = new InterceptReq('/account_settings/modify_2fa', 'GetOtpAuthUrl')
  _itcChangePassword = new InterceptAction('/auth/update_password', 'ChangePassword')

  deleteExistingEmailAuth(user, callback = () => {}) {
    let isMember2FaEnabled = false
    cy.get('@member').within(($tr) => {
      cy.wrap($tr)
        .find('td:last')
        .within(($td) => {
          if ($td.find('span:contains("Yes")').length) {
            isMember2FaEnabled = true
          }
        })
      cy.wrap($tr).clickDropdownItem('Manage 2-Step Verification')
    })
    cy.get('@member').parents('.member-wrapper').as('memberWrapper')
    cy.get('@memberWrapper').swal2().getSwal2Content().find('> div > div').as('popupBody')
    cy.get('@popupBody')
      .within(($popup) => {
        cy.wrap($popup)
          .cwToggleButton('Require this person to setup 2-Step Verification')
          .toggleProperty('background-color')
        cy.get('@property').then((background) => {
          if (background.includes(Properties.toggleActiveColor)) {
            this._itcRequired2Fa.set()
            cy.get('@button').toggleSwitch()
            this._itcRequired2Fa.wait()
          }
          if (isMember2FaEnabled) {
            cy.contains('p', '2-Step Verification enabled')
            this._itcDisable2Fa.set()
            cy.contains('button', Field.DISABLE).click()
            cy.get('@memberWrapper').swal2().swal2Confirm(Field.YES_DELETE).click()
            this._itcDisable2Fa.wait()
            EmailVerification.verifyEmailDisabled2Fa(user['email'], user['givenName'])
          } else {
            cy.contains('p', '2-Step Verification disabled')
          }
        })
      })
      .then(() => {
        if (isMember2FaEnabled) {
          this.delete2Fa(user)
          callback()
        } else {
          cy.get('@member').swal2().closeSwal2()
        }
      })
  }
  visitAccountSettings() {
    this._itcFetchAccountSettings.set()
    cy.visit('/web/my-profile/account-settings')
    this._itcFetchAccountSettings.wait()
  }
  visitAccountSettingsAnd2StepVerification() {
    this.visitAccountSettings()
    this._itcFetch2StepVerification.set()
    cy.get('.learning-wrapper').clickCwDropdownItem('2-Step Verification')
    this._itcFetch2StepVerification.wait()
    this.defineAccountSettingMainContentAlias()
  }
  delete2Fa(user, authType = 'Email Verification') {
    cy.signInViaEmail(user['email'], user['screenName'])
    this.visitAccountSettingsAnd2StepVerification()
    cy.get('@mainContent').within(($content) => {
      cy.wrap($content)
        .contains('strong.text-black', authType)
        .parents('.cec-card')
        .find('a.link-icon')
        .click()
      this._itcFetch2StepVerification.set()
      this._itcDisableEmailAuth.set()
      cy.wrap($content)
        .getPopup()
        .getPopupBody()
        .typeInput(`${Credentials.getPassword()} {enter}`, 'password')
      this._itcDisableEmailAuth.wait()
      this._itcFetch2StepVerification.wait()
    })
  }
  toggleRequired2Fa(enabled) {
    cy.get('@member').parents('.member-wrapper').as('memberWrapper')
    cy.get('@member').within(($tr) => {
      cy.wrap($tr).clickDropdownItem('Manage 2-Step Verification')
      cy.wrap($tr).swal2().getSwal2Content().find('> div > div').as('popupBody')
    })
    cy.get('@popupBody').within(($popup) => {
      cy.wrap($popup)
        .cwToggleButton('Require this person to setup 2-Step Verification')
        .toggleProperty('background-color')
    })
    cy.get('@property').then((backgroundColor) => {
      if (this.isCorrectToggleRequired2Fa(enabled, backgroundColor)) {
        this._itcRequired2Fa.set()
        cy.get('@button').toggleSwitch()
        if (enabled) {
          cy.get('@memberWrapper').swal2().swal2Confirm(Field.YES_SET).click()
        }
        this._itcRequired2Fa.wait()
      } else {
        cy.get('@memberWrapper').swal2().closeSwal2()
      }
    })
  }
  isCorrectToggleRequired2Fa(enabled, toggleBgColor) {
    return (
      (enabled && !toggleBgColor.includes(Properties.toggleActiveColor)) ||
      (!enabled && toggleBgColor.includes(Properties.toggleActiveColor))
    )
  }
  setRequired2FaAndSetupViaEmail(user) {
    this.toggleRequired2Fa(true)
    cy.signInViaEmail(user['email'], user['screenName'])
    this.setup2FaViaEmail()
    if (!new Environment().isPrd()) {
      this.checkLoginUsing2FaViaEmail(user)
    } else {
      //TODO: implement test login with backup codes for PRD user
    }
  }
  checkLoginUsing2FaViaEmail(user) {
    cy.signInViaEmail(user['email'], user['screenName'])
    this.enterTwoFactorCode(user)
  }
  enterTwoFactorCode(user) {
    const emailHelper = new EmailHelper()
    emailHelper.getReceivedEmailSubject('OTP code', user, true).then(($res) => {
      if (!$res) return
      const otpCode = $res.split(' ')[2].trim()
      cy.get('#kc-content-wrapper').within(() => {
        Cypress.on('uncaught:exception', () => false) //Do not remove
        cy.get('#otp').type(`${otpCode} {enter}`)
      })
      cy.wait('@getAuthenticate').then((auth) => {
        if (auth) {
          cy.wrap(auth).its('state').should('eq', 'Complete')
          cy.url().should('include', '/u/home/dashboard')
        }
      })
    })
  }
  setup2FaViaEmail() {
    cy.url().should('include', this._setupAuthenticationPage, {
      timeout: 50000,
    })
    cy.get('.authentication-contain').within(($content) => {
      cy.wrap($content).cecCard().cecCardBody().cecCard().as('cardInner')
    })
    cy.get('@cardInner')
      .first()
      .within(($cardInner) => {
        cy.wrap($cardInner).contains('div.cursor-pointer', 'Email Verification').click()
        cy.wrap($cardInner).getPopup().as('popup')
      })
    cy.get('@popup').within(($popup) => {
      this._itcFetch2StepVerification.set()
      this._itcConfirmPassword.set()
      this._itcEnableEmailAuth.set()
      cy.wrap($popup).getPopupBody().typeInput(`${Credentials.getPassword()}`, 'password')
      cy.wrap($popup).getPopupFooter().contains('button', Field.CONFIRM).click()
      this._itcConfirmPassword.wait()
      this._itcEnableEmailAuth.wait()
      this._itcFetch2StepVerification.wait()
      cy.url().should('include', '/web/my-profile/account-settings')
    })
    this.validateSetup2FaViaEmail()
  }
  defineAccountSettingMainContentAlias() {
    cy.get('.account-settings-wrapper').within(($wrapper) => {
      cy.wrap($wrapper).cecCard().cardMainContent().as('mainContent')
    })
  }
  validateSetup2FaRequiredFromOrg() {
    cy.get('@mainContent').within(($content) => {
      cy.contains(
        'div',
        'Your organization has required for you to enable 2-Step Verification. You cannot disable it on your own.'
      )
      cy.wrap($content)
        .contains('strong.text-black', '2-Step Verification')
        .parentsUntil('div.cec-card')
        .cwToggleButton('Enabled')
        .toggleIsEnable()
      cy.get('@button').isCheckboxDisabled()
    })
  }
  verifySetup2FaItem(name, description, checkTrashIcon) {
    cy.get('@mainContent').within(() => {
      cy.contains('strong.text-black', name).parent().parent().parent().children().as('itemWrapper')
    })
    if (checkTrashIcon) {
      cy.get('@itemWrapper').first().find('a.link-icon').hasSvgIcon()
    }
    cy.get('@itemWrapper').last().as('itemNameWrapper')
    if (description) {
      cy.get('@itemNameWrapper').contains('span', description)
    }
    cy.get('@itemNameWrapper').find('div').hasSvgIcon()
  }
  validateSetup2FaViaEmail() {
    this.defineAccountSettingMainContentAlias()
    this.validateSetup2FaRequiredFromOrg()
    this.verifySetup2FaItem(this._emailVerification, this._emailVerificationDes)
  }
  validateAllSetup2Fa() {
    this.defineAccountSettingMainContentAlias()
    this.validateSetup2FaRequiredFromOrg()
    this.verifySetup2FaItem(this._authenticationApp, this._authenticationAppDes, true)
    this.verifySetup2FaItem(this._emailVerification, this._emailVerificationDes, true)
    this.verifySetup2FaItem(this._backupCode, this._backupCodeDes, true)
  }
  resetPassword() {
    cy.url().should('include', this._setupAuthenticationPage)
    cy.get('.authentication-contain').within(($content) => {
      cy.get('#_setupAuthenticationPortlet_newPassword').focus().type(pwd, { log: false })
      cy.get('#_setupAuthenticationPortlet_confirmPassword').focus().type(pwd, { log: false })
      this._itcChangePassword.set()
      cy.wrap($content).contains('button', 'Change password').click()
      this._itcChangePassword.wait()
    })
  }
  verifySetup2FaPage() {
    this.getAuthenticationPageSections()
    cy.get('@authHeader')
      .find('> img')
      .should('contain.attr', 'src', '/o/cw-image-rest/thumbnail/company-master-logo')
      .and('be.visible')
    this.verifySecurityAlertPage()
    this.verifyAuthViaApp()
    cy.get('@authenticationContainer').within(($container) => {
      cy.wrap($container).contains('div.text-center', 'Powered by Crosswired.')
    })
  }
  verifySecurityAlertPage() {
    cy.get('@authCardBody')
      .contains('div > span.font-weight-light', 'Security alert')
      .should('have.class', 'text-gray')
      .and('have.class', 'font-size-26')
    cy.get('@authCardBody').find('div.warning-banner').as('authWarningBanner')
    cy.get('@authWarningBanner')
      .should('have.class', 'border')
      .and('have.css', 'background-color', 'rgb(254, 253, 184)')
    cy.get('@authWarningBanner').hasSvgIcon()
    cy.get('@authWarningBanner').contains(
      'div',
      'For added security, your organization has required for you to set up 2-Step Verification.'
    )
    cy.get('@authCardBody').contains(
      'div',
      'Select a security method to enable 2-Step Verification.'
    )
    cy.get('@authCardInner').within(() => cy.get('div.cursor-pointer').as('authTypeItems'))
    cy.get('@authTypeItems').should('have.length', 2)
    cy.get('@authTypeItems').first().as('authTypeApp')
    cy.get('@authTypeItems').last().as('authTypeEmail')
  }
  verifyAuthViaEmail() {
    cy.get('@authTypeEmail').should('have.css', 'cursor', 'pointer')
    cy.get('@authTypeEmail').hasSvgIcon()
    cy.get('@authTypeEmail').contains('strong', 'Email Verification')
    cy.get('@authTypeEmail').contains('div', 'Set up your email to get verification codes.')
  }
  verifyAuthViaApp() {
    cy.get('@authTypeApp').should('have.css', 'cursor', 'pointer')
    cy.get('@authTypeApp').hasSvgIcon()
    cy.get('@authTypeApp').contains('strong', this._authenticationApp)
    cy.get('@authTypeApp').contains('div', this._authenticationAppDes)
    cy.get('@authTypeApp').click()
    cy.get('@authTypeApp').getPopup().as('identityConfirmPopup')
    cy.get('@identityConfirmPopup').getPopupHeader().contains('span', 'Identity confirmation')
    cy.get('@identityConfirmPopup')
      .getPopupBody()
      .within(($popupBody) => {
        cy.wrap($popupBody).contains('div', 'Please enter your account password')
        cy.wrap($popupBody).find('input[type="password"]').as('inputPassword')
        cy.wrap($popupBody)
          .contains('div > span', 'Incorrect password. Please try again')
          .as('incorrectPasswordWarning')
      })
    cy.get('@incorrectPasswordWarning').should('not.be.visible')
    cy.get('@identityConfirmPopup')
      .getPopupFooter()
      .within(($popupFooter) => {
        cy.wrap($popupFooter).contains('button.btn-primary', Field.CONFIRM).as('confirmButton')
        cy.wrap($popupFooter)
          .contains('button.btn-outline-primary', Field.CANCEL)
          .as('cancelButton')
      })
    this.interceptConfirmPassword(() => cy.get('@confirmButton').click())
    cy.get('@incorrectPasswordWarning').should('be.visible')
    this.interceptConfirmPassword(() => cy.get('@inputPassword').clear().type('123456789 {enter}'))
    cy.get('@incorrectPasswordWarning').should('be.visible')
    this._itcGetOtpAuthUrl.set()
    this.interceptConfirmPassword(() =>
      cy.get('@inputPassword').clear().type(`${Credentials.getPassword()} {enter}`)
    )
    this._itcGetOtpAuthUrl.wait()
    this.verifySetupAuthenticatorApp()
  }
  verifySetupAuthenticatorApp() {
    this.verifySetup2FaStepOneAndTwo()
    cy.get('@setupAuthFooter').contains('button.btn-primary', Field.NEXT).click()
    this.verifySetup2FaStepThree()
  }
  verifySetup2FaStepOneAndTwo() {
    cy.get('@authCardBody').find('> div').as('setupAuthenticatorApp')
    cy.get('@setupAuthenticatorApp')
      .first()
      .contains('span.font-weight-light', 'Setup Authenticator App')
      .should('have.class', 'font-size-26')
      .and('have.class', 'text-gray')
    cy.get('@setupAuthenticatorApp').last().find('> div').as('setupAuthBodyAndFooter')
    cy.get('@setupAuthBodyAndFooter').first().as('setupAuthBody')
    cy.get('@setupAuthBody').contains('span.font-weight-bold', 'Step 1:')
    cy.get('@setupAuthBody').contains('span', 'Install an authenticator app of your choice.')
    cy.get('@setupAuthBody').contains('div', 'Here are some examples:')
    cy.get('@setupAuthBody')
      .contains('div > span.font-weight-bold', '• FreeOTP')
      .should('have.class', 'text-black')
    cy.get('@setupAuthBody').find('div > img.cursor-pointer').as('freeOptAppImg')
    cy.get('@freeOptAppImg')
      .first()
      .should('be.visible')
      .should('have.class', 'w-30')
      .should('have.attr', 'src')
    cy.get('@freeOptAppImg')
      .last()
      .should('be.visible')
      .should('have.class', 'w-30')
      .should('have.attr', 'src')
    cy.get('@setupAuthBody').contains('span.font-weight-bold', 'step-2') //TODO: replace 'step-2' with 'Step 2:' after language keys issues fixed
    cy.get('@setupAuthBody').contains(
      'div',
      'Open the authenticator app of your choice and scan the QR Code:'
    )
    // cy.get('#qrCodeContainer')  //TODO: uncomment this section after the issue click on back button doesn't generate QR code
    //   .find('> img')
    //   .should('be.visible')
    //   .should('contain.attr', 'src')
    cy.get('@setupAuthBodyAndFooter').last().as('setupAuthFooter')
    cy.get('@setupAuthFooter')
      .contains('a.link-icon', 'back') //TODO: replace 'back' with 'Back' after language keys issues fixed
      .as('backButton')
    cy.get('@backButton').should('have.class', 'cursor-pointer').hasSvgIcon()
  }
  verifySetup2FaStepThree() {
    cy.get('@authCardBody').contains('span.font-weight-bold', 'Step 3:')
    cy.get('@authCardBody').contains('div', 'Enter the one-time code provided in the application.')
    cy.get('@authCardBody').contains('div.font-weight-bold', 'One-time code')
    cy.get('@authCardBody')
      .find('input.otp-input')
      .should('have.attr', 'type', 'number')
      .and('have.attr', 'required', 'required')
      .as('inputOtpCode')
    cy.get('@authCardBody')
      .contains('div > span.text-danger', 'Invalid code. Please try again.')
      .as('invalidCodeWarning')
    cy.get('@invalidCodeWarning').should('not.be.visible')
    cy.get('@backButton').should('have.class', 'cursor-pointer').hasSvgIcon()
    cy.get('@setupAuthFooter').contains('button.btn-primary', 'Turn on').as('turnOn2FaViaApp')
    this.interceptConfirmOtpCode(() => cy.get('@turnOn2FaViaApp').click())
    cy.get('@invalidCodeWarning').should('be.visible')
    this.interceptConfirmOtpCode(() => {
      cy.get('@inputOtpCode').type('123456')
      cy.get('@turnOn2FaViaApp').click()
    })
    cy.get('@invalidCodeWarning').should('be.visible')
    this.verifyStepBack()
  }
  verifyStepBack() {
    cy.get('@backButton').click()
    this.verifySetup2FaStepOneAndTwo()
    cy.get('@backButton').click()
    this.verifySecurityAlertPage()
    this.verifyAuthViaEmail()
  }
  interceptConfirmOtpCode(callback) {
    this._itcConfirmOtpCode.set()
    callback()
    this._itcConfirmOtpCode.wait()
  }
  interceptConfirmPassword(callback) {
    this._itcConfirmPassword.set()
    callback()
    this._itcConfirmPassword.wait()
  }
  getAuthenticationPageSections() {
    cy.url().should('include', this._setupAuthenticationPage)
    cy.get('.authentication-contain').as('authenticationContainer')
    cy.get('@authenticationContainer').within(() => {
      cy.get('.authentication-header').as('authHeader')
      cy.cecCard().cecCardBody().as('authCardBody')
      cy.get('@authCardBody').within(() => cy.cecCard().as('authCardInner'))
    })
  }
  click2FaToggle() {
    cy.get('.cw-toggle-button').within(() => {
      cy.get('.slider').click()
    })
  }
  getResponseResultFromFetching2FA() {
    return this._itcFetch2StepVerification.getResponse().its('response.body.result')
  }
  confirmIdentityFor2FA() {
    if (!this._identityConfirmed) {
      cy.getPopup().within(($popup) => {
        cy.wrap($popup).get('input[type="password"]').type(pwd, { log: false })
        cy.btnConfirm(Field.CONFIRM).click()
      })
      cy.waitLoadingOverlayNotExist()
      this._identityConfirmed = true
    }
  }
  enable2FA() {
    this.getResponseResultFromFetching2FA().then(($result) => {
      const result = JSON.parse($result)
      if (!result.enable2fa) {
        this._itcModify2fa.set()
        this.click2FaToggle()
        this.confirmIdentityFor2FA()
        this._itcModify2fa.wait()
        cy.waitLoadingOverlayNotExist()
      }
    })
  }
  disable2FA() {
    this.getResponseResultFromFetching2FA().then(($result) => {
      const result = JSON.parse($result)
      if (result.enable2fa) {
        this._itcModify2fa.set()
        this.click2FaToggle()
        this.confirmIdentityFor2FA()
        this._itcModify2fa.wait()
        cy.waitLoadingOverlayNotExist()
      }
    })
  }
  turnOn2FAVerification() {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).swal2Confirm('Turn on').click()
    })
  }
  getEmailVerificationMethodElement() {
    cy.getElementWithLabel('Email Verification', 'strong')
      .parents('.row.justify-content-between')
      .as('emailMethod')
  }
  setUp2FAEmailMethodVerification() {
    this._itcEnableEmailAuth.set()
    this.getEmailVerificationMethodElement()
    cy.get('@emailMethod').within(() => {
      cy.clickButtonByName('Set Up')
    })
    this.confirmIdentityFor2FA()
    this.turnOn2FAVerification()
    this._itcEnableEmailAuth.wait()
    cy.waitLoadingOverlayNotExist()
  }
  remove2FAEmailMethodVerification() {
    this.getEmailVerificationMethodElement()
    cy.get('@emailMethod').within(($emailMethod) => {
      if (!$emailMethod.find('button').length) {
        cy.get('a.btn.link-icon').click()
      }
    })
  }
}

export default SetupAuthentication
