import Epic from '../../../../classes/Epic'
import ManageMemberProfile from '../../../../classes/org-management/ManageMemberProfile'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let invitedEmail
  let invitedDuplicateEmail
  let invitedInvalidEmail
  const manageMemberProfile = new ManageMemberProfile()
  const manageUsers = new ManageUsers()

  const EMAIL_TEMPLATE = ['Email', 'First Name', 'Last Name']

  before(() => {
    cy.readFile('cypress/fixtures/validation/email.yaml').then((bulkInviteString) => {
      const emails = YAML.parse(bulkInviteString).BulkInvite.emails
      invitedEmail = emails[0]
      invitedDuplicateEmail = emails[1]
      invitedInvalidEmail = emails[2]
    })
  })

  context(Story.manageUsersMembersProfileEncryption, () => {
    it('Org Admin invite bulk users via excel file and send emails notification to users', () => {
      Story.ticket('QA-438')
      manageUsers.accessManageUsersTabByAdmin()
      manageMemberProfile.bulkInvite()
      manageMemberProfile.downloadExcelTemplate()
      manageMemberProfile.expectCorrectTemplate(EMAIL_TEMPLATE)

      manageMemberProfile.addAttachment('/attachments/inviteUserList.xlsx')
      manageMemberProfile.addToInvite()
      manageMemberProfile.next()
      manageMemberProfile.sendInvite()

      manageMemberProfile.expectGetInviteEmail(invitedEmail)
      manageMemberProfile.expectAtLeastOneInviteEmail(invitedDuplicateEmail)
      manageMemberProfile.expectNotSendAnInviteEmail(invitedInvalidEmail)
    })
  })
})
