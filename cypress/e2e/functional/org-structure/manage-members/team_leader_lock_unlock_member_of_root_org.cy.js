import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgStructure, () => {
  const manageMembers = new ManageMembers()
  let rootLockUser

  before(() => {
    cy.stubUser(UserRole.ROOT_ORG_UNIT.LOCK)
    cy.get('@stubUser').then((user) => {
      rootLockUser = user
    })
  })

  context(Story.addRemoveMemberAndTeamLeader, () => {
    it('Team Leader lock/unlock member account of Root Org', () => {
      Story.ticket('QA-85')
      manageMembers.login.toRootOrgUnitManageMembersTabAsTeamLeaderRootOrg()
      manageMembers.lockAccount(rootLockUser.email)
      manageMembers.verifyLockAccountSuccess(rootLockUser)
      cy.logInTestCase('Reset: Unlock account user')
      manageMembers.login.toRootOrgUnitManageMembersTabAsTeamLeaderRootOrg()
      manageMembers.unlockAccount(rootLockUser.email)
      manageMembers.verifyUnlockAccountSuccess(UserRole.ROOT_ORG_UNIT.LOCK)
    })
  })
})
