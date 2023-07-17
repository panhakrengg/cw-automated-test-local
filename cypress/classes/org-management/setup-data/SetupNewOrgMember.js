import WebNotification from '../../notification/WebNotification'
import EmailHelper from '../../utilities/EmailHelper'
import EnvLogin from '../../utilities/EnvLogin'
import SignInAs from '../../utilities/SignInAs'
import ManageMemberProfile from '../ManageMemberProfile'
import ManageUsers from '../org-structure/ManageUsers'

class SetupNewOrgMember {
  manageUser = new ManageUsers()
  emailHelper = new EmailHelper()
  manageMemberProfile = new ManageMemberProfile()

  fullProcessAddNewOrgMember(user) {
    this.visitManageUsersFireCloud()
    this.manageUser.inviteUserToJoinOrganization(user)
    this.acceptThenRegister(user)
  }

  fullProcessAddCwUserToOrg(user) {
    this.visitManageUsersFireCloud()
    this.manageUser.inviteUserToJoinOrganization(user)
    this.acceptInvitation(user.email)
  }

  fullProcessRemoveOrgMember(user) {
    this.visitManageUsersFireCloud()
    this.manageUser.findUserRow(user.screenName)
    this.manageUser.removeUserFromOrganization()
  }

  visitManageUsersFireCloud() {
    this.manageUser.interceptGetUsers()
    SignInAs.orgAdmin_Amy('/web/firecloud-zone/manage-users')
    this.manageUser.waitGetUsers()
    this.manageUser.defineAliasForManageMemberWrapper()
  }

  acceptThenRegister(user) {
    Cypress.on('uncaught:exception', () => false)
    this.emailHelper
      .getReceivedEmail(`Invitation to join FireCloud Zone organization`, user.email)
      .visitCreateAccount()
    this.fillCreateYourProfile(user)
    this.clickRegister()
  }

  acceptInvitation(email, orgName = 'FireCloud Zone') {
    const notification = `would like to add you into ${orgName} organization.`

    cy.signInViaEmail(email)
    new WebNotification().acceptRequest(notification)
  }

  fillCreateYourProfile(user) {
    cy.inputByPlaceholder('Enter your first name', user.givenName)
    cy.inputByPlaceholder('Enter your last name', user.familyName)
    cy.inputFormGroup('Screen Name', user.screenName)
    cy.inputByPlaceholder('mm/dd/yyyy', '1992-02-02')
    cy.inputByPlaceholder('Enter your password', EnvLogin.envPass())
    cy.inputByPlaceholder('Confirm your password', EnvLogin.envPass())
    cy.get('form').getCheckbox().check()
  }

  clickRegister() {
    cy.clickButtonByName('Register')
  }
}
export default SetupNewOrgMember
