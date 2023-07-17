import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import { SubOrgConst } from '../../../../classes/org-management/base-org-management/SubOrgStub'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgStructure, () => {
  const orgUnitInfo = new OrgUnitInfo()
  const manageMembers = new ManageMembers()
  const setupAuthentication = new SetupAuthentication()
  let drawPlanMember, drawPlanMemberEmail, drawPlanMemberGivenName

  before(() => {
    cy.stubUser(UserRole.DRAW_FEATURE_PLAN.TWO_FA_PLAN)
    cy.get('@stubUser').then((user) => {
      drawPlanMember = user
      drawPlanMemberEmail = user.email
      drawPlanMemberGivenName = user.givenName
    })
  })

  function signInAndInit() {
    orgUnitInfo.orgAdminAccessToMemberSubOrgUnit(SubOrgConst.DRAWING_FEATURE_PLAN)
    manageMembers.initAliasMembersSection()
    manageMembers.initARowMemberByEmail(drawPlanMemberEmail)
  }

  context(ManageMembers.storyAddRemoveMemberAndTeamLeader, () => {
    it('Org Admin enable 2-step verification on member Sub Org using method email verification Drawing Featured Plan', () => {
      Story.ticket('QA-123')
      signInAndInit()
      cy.logInTestCase('Reset Data')
      setupAuthentication.deleteExistingEmailAuth(drawPlanMember, () => {
        signInAndInit()
      })

      cy.logInTestCase('sign in  method email verification')
      setupAuthentication.setRequired2FaAndSetupViaEmail(drawPlanMember)
    })
  })
})
