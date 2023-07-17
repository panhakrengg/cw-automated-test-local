import EmailOrgManagement from '../notification/email/EmailOrgManagement'
import EmailHelper from '../utilities/EmailHelper'

class ManageMemberProfile {
  #emailHelper = new EmailHelper()
  #inviteEmailSubject = EmailOrgManagement.INVITE_EMAIL_SUBJECT
  #inviteEmailBody = EmailOrgManagement.INVITE_EMAIL_BODY
  #inviteEmailCustomBody = EmailOrgManagement.INVITE_EMAIL_CUSTOM_BODY

  addToInvite() {
    cy.get('button:contains("Add to Invite")').click()
  }

  expectInviteButtonDisabled() {
    cy.get('button:contains("Add to Invite")').should('have.attr', 'disabled')
  }

  expectToSeeInvalidFileFormat() {
    cy.get('.mt-4 > .mb-3 > :nth-child(1)').should('contain.text', 'The file format is invalid')
  }

  addAttachment(filePath) {
    cy.get('.cw-dropzone-drop-area').attachFile(filePath, {
      encoding: 'utf-8',
      subjectType: 'drag-n-drop',
    })
  }

  sendInvite() {
    cy.intercept('**organization%2Finvite_members').as('inviteMembers')
    cy.get('button:contains("Send invite")').click()
    cy.wait('@inviteMembers')
  }

  next() {
    cy.get('button:contains("Next")').click()
  }

  addAnotherPerson() {
    cy.get('span:contains("Add another person ")').click()
  }

  expectToHaveErrorMessage(errorMessage) {
    cy.get('.swal2-header').click()
    cy.get('.consent-scroll-content').contains(errorMessage).should('be.visible')
  }

  #getAvailableEmailElement(reverseElement = false, callback = () => {}) {
    this.getInputEmailElement().then(($elements) => {
      callback(reverseElement ? $elements.get().reverse() : $elements)
    })
  }

  inputEmail(emails = [], reverseElement = false) {
    this.#getAvailableEmailElement(reverseElement, ($elements) => {
      if ($elements.length) {
        cy.wrap($elements).each(($element, $index) => {
          cy.wrap($element).type(emails[$index])
        })
      }
    })
  }

  clearInputEmail() {
    this.getInputEmailElement().clear()
  }

  getInputEmailElement() {
    return this.#getInputElementByLabel('email')
  }

  lostFocusEmailElement() {
    return this.getInputEmailElement().blur()
  }

  #getInputElementByLabel(entry) {
    return cy
      .get('.consent-scroll-content .cec-mt-2 .row')
      .find(`input[name="qualify('${entry}')"]`)
  }

  expectNextButtonShouldBeDisabled() {
    cy.get('button:contains("Next")').should('have.attr', 'disabled')
  }

  bulkInvite() {
    this.invitePeople()
    cy.get('.cw-split-dropdown > .dropdown-menu > :nth-child(2) > .dropdown-item').click()
  }

  inviteViaEmail() {
    this.invitePeople()
    cy.get('.cw-split-dropdown > .dropdown-menu > :nth-child(1) > .dropdown-item').click()
  }

  invitePeople() {
    cy.get('button:contains("Invite People")').click()
  }

  downloadExcelTemplate() {
    cy.request(
      'GET',
      '/web/weblearn/manage-users?p_p_id=orgManageUsersPortlet&p_p_lifecycle=2&p_p_cacheability=cacheLevelPage&p_p_resource_id=%2Ffetch%2Fdownload%2Fexcel%2Ftemplate'
    ).then(($response) => {
      cy.downloadFile($response.body.result, 'cypress/downloads', 'inviteUserList.xlsx')
    })
  }

  expectCorrectTemplate(templateColumns) {
    cy.parseXlsx('cypress/downloads/inviteUserList.xlsx').then((jsonData) => {
      expect(jsonData[0].data[0]).to.eqls(templateColumns)
    })
  }

  expectGetInviteEmail(invitedEmail) {
    this.#emailHelper
      .getReceivedEmail(this.#inviteEmailSubject, invitedEmail, true)
      .then(($receiveEmail) => {
        this.verifyInvitationEmail($receiveEmail)
      })
  }

  expectAtLeastOneInviteEmail(invitedEmail) {
    this.#emailHelper
      .getReceivedEmailBySubjectCount(this.#inviteEmailSubject, invitedEmail, true)
      .should('have.length.at.least', 1)
  }

  expectNotSendAnInviteEmail(invitedEmail) {
    this.#emailHelper
      .getReceivedEmailBySubjectCount(this.#inviteEmailSubject, invitedEmail, true)
      .should('be.null')
  }
  verifyInvitationEmail(subject) {
    const emailTemplate = new DOMParser().parseFromString(subject, 'text/html')
    if (emailTemplate.getElementsByTagName('table').length) {
      const emailHeader = emailTemplate.getElementsByTagName('table')[0].textContent
      const inviteEmailBody = emailHeader.includes(this.#inviteEmailBody)
        ? this.#inviteEmailBody
        : this.#inviteEmailCustomBody
      expect(emailHeader).to.contains(inviteEmailBody)
    }
  }
}

export default ManageMemberProfile
