import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import Field from '../../../classes/constants/Field'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Registration from '../../../classes/my-profile/Registration'
import ManageMemberProfile from '../../../classes/org-management/ManageMemberProfile'
import ManageUsers from '../../../classes/org-management/org-structure/ManageUsers'
import YamlHelper from '../../../classes/utilities/YamlHelper'

describe(Epic.Profile, { retries: 2 }, () => {
  const registration = new Registration()
  const manageUsers = new ManageUsers()
  const profileInfo = new ProfileInfo()
  const manageMemberProfile = new ManageMemberProfile()

  context(Story.profileContactInfo, () => {
    const nonCwUser = new YamlHelper('non-cw-users')
    let nonCw01Email
    let teamLeader

    before(() => {
      nonCwUser
        .read()
        .its('cw01.email')
        .then(($email) => {
          nonCw01Email = $email
        })
      profileInfo.stub.getProfileStatic((data) => {
        teamLeader = data.users.teamLeader.contactInfo
      })
    })
    it('Org Admin invite Non-Cw User into organization and user create account and get validate screen name', () => {
      //This will avoid uncaught exception that didn't handle correctly by our application
      cy.once('uncaught:exception', () => false)
      Story.ticket('QA-832')
      context('Invite non cw user into organization', () => {
        manageUsers.accessManageUsersTabByAdmin()
        manageMemberProfile.inviteViaEmail()
        manageMemberProfile.inputEmail([nonCw01Email])
        manageMemberProfile.next()
        manageMemberProfile.sendInvite()
        manageMemberProfile.expectGetInviteEmail(nonCw01Email)
        cy.get('@getReceivedEmail').visitCreateAccount()
      })

      context('Verify registration form', () => {
        registration.fillInInfoToCreateNewAccount(teamLeader)
        registration.registerButtonIsEnabled()
        registration.clickRegisterButton()
        registration.expectedShowNotAvailableScreenName()
        registration.userStillInRegistrationPage()
      })

      context('Remove invited org user', () => {
        manageUsers.accessManageUsersTabByAdmin()
        manageUsers.interceptGetUsers()
        manageUsers.findUserRow(nonCw01Email)
        manageUsers.waitGetUsers()
        manageUsers.removeUserFromOrganization(Field.REMOVE)
      })
    })
  })
})
