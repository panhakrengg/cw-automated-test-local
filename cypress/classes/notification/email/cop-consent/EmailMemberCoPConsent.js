import EmailCoPConsent from './EmailCoPConsent'

class EmailMemberCoPConsent extends EmailCoPConsent {
  _member
  constructor(copName, member) {
    super(copName)
    this._member = member
  }

  memberGivenName() {
    return this._member['givenName']
  }
  gaveConsentSubject() {
    return `You Gave Consent to ${this._copName}`
  }
  btnManageConsent() {
    this.emailHelper.verifyLinkButton(
      'Manage Consent',
      '/web/my-profile/account-settings?p_p_id=accountSettingPortlet&amp;p_p_lifecycle=0&amp;_accountSettingPortlet_mvcRenderCommandName=%2F#_accountSettingPortlet_option=consents'
    )
  }
  verifyOptOutGaveConsentEmail() {
    this.expectUserNotReceiveEmail(this.gaveConsentSubject(), this._member)
  }
  verifyGaveConsentEmail() {
    cy.log(`${this.memberGivenName()} receive email gave consent`)
    this.emailHelper
      .getReceivedEmail(
        this.gaveConsentSubject(),
        this._member,
        this._removeExistEmail
      )
      .emailTableBody()
      .then((template) => {
        this.emailHelper.setTemplate(template)
        this.emailHelper.verifyText(`Dear ${this.memberGivenName()}`, 'div')
        this.emailHelper.verifyText(
          `You gave consent to ${this._copName} in order to join this community.`,
          'div'
        )
        this.emailHelper.verifyText('Review the consent form below.', 'div')
        this.btnManageConsent()
      })
  }
}

export default EmailMemberCoPConsent
