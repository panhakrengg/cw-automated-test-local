import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgStructure, { retries: 1 }, () => {
  const manageMembers = new ManageMembers()
  let lockUser

  before(() => {
    cy.stubUser(UserRole.DRAW_FEATURE_PLAN.LOCK)
    cy.get('@stubUser').then((user) => {
      lockUser = user
    })
  })

  context(Story.addRemoveMemberAndTeamLeader, () => {
    it('Org Admin lock/unlock member account of Sub Org Drawing Featured Plan', () => {
      Story.ticket('QA-326')
      manageMembers.login.toSubOrgUnitManageMembersTabAsOrgAdminDrawingFeaturePlan()
      manageMembers.lockAccount(lockUser.email)
      manageMembers.verifyLockAccountSuccess(lockUser)
      cy.logInTestCase('Reset: Unlock account user')
      manageMembers.login.toSubOrgUnitManageMembersTabAsOrgAdminDrawingFeaturePlan()
      manageMembers.unlockAccount(lockUser.email)
      manageMembers.verifyUnlockAccountSuccess(UserRole.DRAW_FEATURE_PLAN.LOCK)
    })
  })
})
