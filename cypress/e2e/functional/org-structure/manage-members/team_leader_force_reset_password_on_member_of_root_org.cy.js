import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgStructure, { retries: 1 }, () => {
  const manageMembers = new ManageMembers()
  let rootMemberEmail

  before(() => {
    cy.stubUser(UserRole.ROOT_ORG_UNIT.TEAM_LEADERS)
    cy.get('@stubUser').then((user) => {
      rootMemberEmail = user.email
    })
  })

  context(Story.addRemoveMemberAndTeamLeader, () => {
    it('Team Leader force reset password on member of Root Org', () => {
      Story.ticket('QA-317')
      manageMembers.login.toRootOrgUnitManageMembersTabAsTeamLeaderRootOrg()
      manageMembers.checkForcePasswordReset(rootMemberEmail)
      manageMembers.verifyResetPasswordSuccessWhenLogin(rootMemberEmail)
      manageMembers.dashboardAssertion.verifyLoginByRoleSuccess(UserRole.ROOT_ORG_UNIT.TEAM_LEADERS)
    })
  })
})
