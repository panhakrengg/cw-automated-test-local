import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgStructure, { retries: 1 }, () => {
  const manageMembers = new ManageMembers()
  const setupAuthentication = new SetupAuthentication()
  let rootMember, rootMemberEmail, rootMemberGivenName

  before(() => {
    cy.stubUser(UserRole.ROOT_ORG_UNIT.TWO_FA_ROOT_ORG)
    cy.get('@stubUser').then((user) => {
      rootMember = user
      rootMemberEmail = user.email
      rootMemberGivenName = user.givenName
    })
  })

  function signInAndInit() {
    manageMembers.login.toRootOrgUnitManageMembersTabAsTeamLeaderRootOrg()
    manageMembers.initAliasMembersSection()
    manageMembers.initARowMemberByEmail(rootMemberEmail)
  }

  context(ManageMembers.storyAddRemoveMemberAndTeamLeader, () => {
    it('Team Leader enable 2-step verification on member Root Org using method email verification', () => {
      Story.ticket('QA-84')
      signInAndInit()
      cy.logInTestCase('Reset Data')
      setupAuthentication.deleteExistingEmailAuth(rootMember, () => {
        signInAndInit()
      })

      setupAuthentication.setRequired2FaAndSetupViaEmail(rootMember)
    })
  })
})
