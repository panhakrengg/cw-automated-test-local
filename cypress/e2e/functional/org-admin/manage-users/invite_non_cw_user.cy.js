import Epic from '../../../../classes/Epic'
import EmailOrgManagement from '../../../../classes/notification/email/EmailOrgManagement'
import ManageMemberProfile from '../../../../classes/org-management/ManageMemberProfile'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'
import EmailHelper from '../../../../classes/utilities/EmailHelper'

let nonCw02Email
const emailHelper = new EmailHelper()
const manageUsers = new ManageUsers()
const manageMemberProfile = new ManageMemberProfile()
const inviteEmailSubject = EmailOrgManagement.INVITE_EMAIL_SUBJECT
describe(Epic.OrgAdmin, () => {
  before(() => {
    cy.readFile('cypress/fixtures/non-cw-users.yaml').then((nonCwUsersString) => {
      nonCw02Email = YAML.parse(nonCwUsersString).cw02.email
    })
  })
  context(Story.manageUsers, () => {
    it('Invite - Non-cw user', () => {
      manageUsers.accessManageUsersTabByAdmin()
      manageMemberProfile.inviteViaEmail()
      manageMemberProfile.inputEmail([nonCw02Email])
      manageMemberProfile.next()
      manageMemberProfile.sendInvite()
      emailHelper
        .getReceivedEmail(inviteEmailSubject, nonCw02Email)
        .then(($receiveEmail) => {
          manageMemberProfile.verifyInvitationEmail($receiveEmail)
        })
        .visitCreateAccount()
    })
  })
})
