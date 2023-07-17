import Epic from '../../../../classes/Epic'
import EmailOrgManagement from '../../../../classes/notification/email/EmailOrgManagement'
import WebNotification from '../../../../classes/notification/WebNotification'
import ManageMemberProfile from '../../../../classes/org-management/ManageMemberProfile'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'
import EmailHelper from '../../../../classes/utilities/EmailHelper'
import SignInAs from '../../../../classes/utilities/SignInAs'

let platformUserEmail
const emailHelper = new EmailHelper()
const manageUsers = new ManageUsers()
const webNotificatinon = new WebNotification()
const manageMemberProfile = new ManageMemberProfile()
const inviteEmailSubject = EmailOrgManagement.INVITE_EMAIL_SUBJECT

describe(Epic.OrgAdmin, () => {
  before(() => {
    cy.readFile('cypress/fixtures/users.yaml').then((cwUsersString) => {
      platformUserEmail = YAML.parse(cwUsersString).Users.uat.allCw.email
    })
  })
  context(Story.manageUsers, () => {
    it('Invite - CW user', () => {
      manageUsers.accessManageUsersTabByAdmin()
      manageMemberProfile.inviteViaEmail()
      manageMemberProfile.inputEmail([platformUserEmail])
      manageMemberProfile.next()
      manageMemberProfile.sendInvite()
      emailHelper.getReceivedEmail(inviteEmailSubject, platformUserEmail).then(($receiveEmail) => {
        manageMemberProfile.verifyInvitationEmail($receiveEmail)
      })

      SignInAs.reSignInAsCwUser()
      webNotificatinon.show()
      webNotificatinon.selectRequestsTab()
      webNotificatinon.expectToSeeInviteToJoinOrganization()
      webNotificatinon.denyToJoinOrganization()
    })
  })
})
