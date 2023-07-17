import InterceptReq from '../base/InterceptReq'
import EmailCommunity from '../notification/email/EmailCommunity'
import EmailHelper from '../utilities/EmailHelper'

class Admin {
  TODO_YOURSELF_MS_COP = 'ToBe Yourself'
  emailHelper = new EmailHelper()
  emailCommunity = new EmailCommunity(this.TODO_YOURSELF_MS_COP)
  itcFetchManageMember = new InterceptReq('/admin/fetch_manage_members', 'FetchManageMember')

  clickInviteButton() {
    cy.get('button:contains("Invite")').first().click()
  }
  clickInviteViaEmailLink() {
    cy.get('a:contains("invite via email")').click()
  }
  inputInviteEmail(emails = []) {
    cy.get(`input[placeholder="Enter e-mail address"]`).clear().type(emails.join(','))
  }
  clickSendInvite() {
    cy.get('button:contains("Send invite")').click()
  }
  sendInviteEmails(emails = []) {
    this.clickInviteButton()
    cy.swal2().within(() => {
      this.clickInviteViaEmailLink()
      this.inputInviteEmail(emails)
      this.clickSendInvite()
    })
  }
  verifyInvitationEmail(subject, copName) {
    const emailCommunity = new EmailCommunity(copName)
    const emailTemplate = new DOMParser().parseFromString(subject, 'text/html')
    if (emailTemplate.getElementsByTagName('table').length) {
      const emailHeader = emailTemplate.getElementsByTagName('table')[0].textContent
      expect(emailHeader).to.contains(emailCommunity.getInvitationHeader())
    }
  }
  verifyInvitationEmailTemplate(email) {
    this.emailHelper
      .getReceivedEmail(this.emailCommunity.getInvitationSubject(), email)
      .then(($receiveEmail) => {
        this.verifyInvitationEmail($receiveEmail, this.TODO_YOURSELF_MS_COP)
      })
      .getEmailElementHref('Create new account')
  }
  redirectToCreateNewAccount() {
    cy.get('@elementHref').then(($url) => {
      cy.visit($url)
    })
  }
}
export default Admin
