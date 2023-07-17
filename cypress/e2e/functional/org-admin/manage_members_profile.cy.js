import YAML from 'yamljs'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import EmailOrgManagement from '../../../classes/notification/email/EmailOrgManagement'
import ManageMemberProfile from '../../../classes/org-management/ManageMemberProfile'
import { OrgConst } from '../../../classes/org-management/base-org-management/OrgStub'
import EmailHelper from '../../../classes/utilities/EmailHelper'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let teamLeadEmail
  let memberInstructionEmail
  let nonCw01Email
  let nonCw02Email
  const inviteEmailSubject = EmailOrgManagement.INVITE_EMAIL_SUBJECT
  const emailHelper = new EmailHelper()
  const manageMemberProfile = new ManageMemberProfile()

  before(() => {
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgUsersString) => {
      const orgUsers = YAML.parse(OrgUsersString)
      const teamLeadInstruction = orgUsers.Users.uat.teamLeadInstruction
      const memberInstruction = orgUsers.Users.uat.memberInstruction
      teamLeadEmail = teamLeadInstruction.email
      memberInstructionEmail = memberInstruction.email
    })
    cy.readFile('cypress/fixtures/non-cw-users.yaml').then((nonCwUsersString) => {
      const nonCwUsers = YAML.parse(nonCwUsersString)
      nonCw01Email = nonCwUsers.cw01.email
      nonCw02Email = nonCwUsers.cw02.email
    })
  })

  beforeEach(() => {
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_USERS)
  })

  context(Story.manageUsersMembersProfileEncryption, () => {
    it('Validation check on valid email', () => {
      manageMemberProfile.inviteViaEmail()
      manageMemberProfile.inputEmail(['invalidEmail.au'])
      manageMemberProfile.expectToHaveErrorMessage('Please enter a valid email address.')
      manageMemberProfile.expectNextButtonShouldBeDisabled()
    })
    it('Verify required field', () => {
      manageMemberProfile.inviteViaEmail()
      manageMemberProfile.inputEmail(['validEmail@gmail.com'])
      manageMemberProfile.clearInputEmail()
      manageMemberProfile.expectToHaveErrorMessage('This field is required.')
      manageMemberProfile.expectNextButtonShouldBeDisabled()
    })
    it('Can not enter duplicate email', () => {
      manageMemberProfile.inviteViaEmail()
      manageMemberProfile.addAnotherPerson()
      manageMemberProfile.inputEmail(['one@gmail.com', 'one@gmail.com'], true)
      manageMemberProfile.expectToHaveErrorMessage('Duplicate email entry')
      manageMemberProfile.expectNextButtonShouldBeDisabled()
    })
    it('Bulk Invite - invalid file', () => {
      manageMemberProfile.bulkInvite()
      manageMemberProfile.addAttachment('/attachments/cw-circle-logo.png')
      manageMemberProfile.expectToSeeInvalidFileFormat()
      manageMemberProfile.expectInviteButtonDisabled()
    })
    it('Bulk Invite - valid file', () => {
      manageMemberProfile.bulkInvite()
      manageMemberProfile.addAttachment('/attachments/inviteNonCwUserList.xlsx')
      manageMemberProfile.addToInvite()
      manageMemberProfile.next()
      manageMemberProfile.sendInvite()
      emailHelper.getReceivedEmail(inviteEmailSubject, nonCw01Email).then(($receiveEmail) => {
        manageMemberProfile.verifyInvitationEmail($receiveEmail)
      })
      emailHelper.getReceivedEmail(inviteEmailSubject, nonCw02Email).then(($receiveEmail) => {
        manageMemberProfile.verifyInvitationEmail($receiveEmail)
      })
    })
    it('Verify search', () => {
      cy.get('.search-box-wrapper > .d-flex').type(`"${teamLeadEmail}" {enter}`)
      cy.intercept('GET', '**manage_users%2Fmembers%2Fget').as('getSearchResult')
      cy.wait('@getSearchResult')
      cy.get('.manage-member-wrapper > :nth-child(1)').should('contain.text', teamLeadEmail)
    })
  })
})
