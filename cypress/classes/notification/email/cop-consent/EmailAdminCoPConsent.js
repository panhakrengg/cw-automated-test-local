import EmailCoPConsent from './EmailCoPConsent'

class EmailAdminCoPConsent extends EmailCoPConsent {
  constructor(copName) {
    super(copName)
  }

  gaveConsentByCoP() {
    return `Your Member Gave Consent to ${this._copName}`
  }

  gaveConsentBody(memberName) {
    return `${memberName} gave consent to ${this._copName} in order to join this community.`
  }

  revokeConsentInCoP() {
    return `Revoked Consent in ${this._copName}`
  }

  revokeConsentBody(memberName) {
    return `${memberName} has revoked his consent in ${this._copName}`
  }

  btnLabelManageConsent() {
    return `Manage Consent in ${this._copName}`
  }

  btnManageConsentInCoP() {
    this.emailHelper.verifyLinkButton(
      this.btnLabelManageConsent(),
      '/web/tcop-tracking-opt-out-functionality/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_option=manage-consent&_copMemberManagementPortlet_mvcRenderCommandName=%2F'
    )
  }

  verifyMemberGaveConsentEmail(coPAdminUser, copMember) {
    cy.log(`${coPAdminUser['screenName']} receive email member gave consent`)
    this.emailHelper
      .getReceivedEmail(this.gaveConsentByCoP(), coPAdminUser, this._removeExistEmail)
      .emailTableBody()
      .then((template) => {
        this.emailHelper.setTemplate(template)
        this.emailHelper.verifyText(`Dear ${coPAdminUser['givenName']}`, 'div')
        this.emailHelper.verifyText(
          `${copMember['givenName']} gave consent to ${this._copName} in order to join this community.`,
          'div'
        )
        this.btnManageConsentInCoP()
      })
  }

  verifyMemberRevokeConsentEmail(coPAdminUser, copMember) {
    cy.log(`${coPAdminUser['screenName']} receive email member revoke consent`)
    this.emailHelper
      .getReceivedEmail(this.revokeConsentInCoP(), coPAdminUser, this._removeExistEmail)
      .emailTableBody()
      .then((template) => {
        this.emailHelper.setTemplate(template)
        this.emailHelper.verifyText(`Dear ${coPAdminUser['givenName']}`, 'div')
        this.emailHelper.verifyText(
          `${copMember['givenName']} has revoked his consent in ${this._copName}`,
          'div'
        )
        this.btnManageConsentInCoP()
      })
  }

  verifyOptOutOnMemberGaveConsent(coPAdminUser) {
    cy.log(`${coPAdminUser['screenName']} not receive email member gave consent`)
    this.expectUserNotReceiveEmail(this.gaveConsentByCoP(), coPAdminUser)
  }

  verifyOptOutOnMemberRevokeConsent(coPAdminUser) {
    cy.log(`${coPAdminUser['screenName']} not receive email member revoke consent`)
    this.expectUserNotReceiveEmail(this.revokeConsentInCoP(), coPAdminUser)
  }
}

export default EmailAdminCoPConsent
