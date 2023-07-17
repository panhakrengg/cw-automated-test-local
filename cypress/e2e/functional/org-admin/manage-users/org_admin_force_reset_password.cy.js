import Epic from '../../../../classes/Epic'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  const manageUsers = new ManageUsers()
  const manageMembers = new ManageMembers()
  let resetPwdEmail

  before(() => {
    cy.stubUser(UserRole.ORG_MEMBER.RESET_PWD)
    cy.get('@stubUser').then((user) => {
      resetPwdEmail = user.email
    })
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Org Admin "Force Reset Password" on a member', () => {
      Story.ticket('QA-65')

      manageUsers.accessManageUsersTabByAdmin()
      manageUsers.findUserRow(resetPwdEmail)
      manageMembers.checkForcePasswordReset(resetPwdEmail, true)
      manageMembers.verifyResetPasswordSuccessWhenLogin(resetPwdEmail)
      manageMembers.dashboardAssertion.verifyLoginByRoleSuccess(UserRole.ORG_MEMBER.RESET_PWD)
    })
  })
})
