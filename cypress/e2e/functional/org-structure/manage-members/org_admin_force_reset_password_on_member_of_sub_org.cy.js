import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgStructure, { retries: 1 }, () => {
  const manageMembers = new ManageMembers()
  let drawPlanMemberEmail

  before(() => {
    cy.stubUser(UserRole.DRAW_FEATURE_PLAN.RESET_PWD)
    cy.get('@stubUser').then((user) => {
      drawPlanMemberEmail = user.email
    })
  })

  context(Story.addRemoveMemberAndTeamLeader, () => {
    it('Org Admin force reset password on member of Sub Org Drawing Featured Plan', () => {
      Story.ticket('QA-83')
      manageMembers.login.toSubOrgUnitManageMembersTabAsOrgAdminDrawingFeaturePlan()
      manageMembers.checkForcePasswordReset(drawPlanMemberEmail)
      manageMembers.verifyResetPasswordSuccessWhenLogin(drawPlanMemberEmail)
      manageMembers.dashboardAssertion.verifyLoginByRoleSuccess(
        UserRole.DRAW_FEATURE_PLAN.RESET_PWD
      )
    })
  })
})
