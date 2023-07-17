import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import GlobalMenu from '../../../../classes/global-menu/GlobalMenu'
import WebNotification from '../../../../classes/notification/WebNotification'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import { SubOrgConst } from '../../../../classes/org-management/base-org-management/SubOrgStub'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

let screenName, email, fullName, teamLeader, orgAdminFullName
describe(Epic.OrgStructure, () => {
  const orgUnitInfo = new OrgUnitInfo()
  const manageMembers = new ManageMembers()
  const globalMenu = new GlobalMenu()
  const webNotification = new WebNotification()
  const drawingPlanOrg = SubOrgConst.DRAWING_FEATURE_PLAN

  before(() => {
    cy.stubUser(UserRole.DRAW_FEATURE_PLAN.TEAM_LEADERS)
    cy.get('@stubUser').then((user) => {
      teamLeader = user
      fullName = user.fullName
      email = user.email
      screenName = user.screenName
    })
    cy.stubUser(UserRole.ORG_ADMIN.ORGANIZATION)
    cy.get('@stubUser').then((user) => {
      orgAdminFullName = user.fullName
    })
  })

  context(ManageMembers.storyAddRemoveMemberAndTeamLeader, () => {
    it('Org Admin can add/edit/remove members and make/remove Team Leader from Drawing Featured Plan', () => {
      Story.ticket('QA-73')
      orgUnitInfo.login.org
      orgUnitInfo.orgAdminAccessToMemberSubOrgUnit(drawingPlanOrg)
      manageMembers.initAliasMembersSection()

      cy.logInTestCase('Reset Data: Remove team leader')
      manageMembers.cleanUpExistingUser(email)

      cy.logInTestCase('Add new member')
      manageMembers.addNewMemberByScreenName(screenName)
      manageMembers.initARowMemberByEmail(email)
      manageMembers.verifyMemberColumn(teamLeader)

      cy.logInTestCase('Edit & mark as Team Leader')
      manageMembers.editMember()
      manageMembers.verifyMemberColumn(teamLeader, true)
      manageMembers.makeMemberAsTeamLeader(email)

      cy.logInTestCase('Verify team leader after successful assigned')
      SignInAs.teamLeaderDrawFeaturePlan(OrgConst.TABS.ORGANIZATION_STRUCTURE)
      globalMenu.getNav('Organization Management', OrgConst.NAME)
      webNotification.show()
      webNotification.seeAssignAsTeamLeader(orgAdminFullName, drawingPlanOrg, true)
      orgUnitInfo.action.accessSubOrgUnit(drawingPlanOrg)
      manageMembers.verifyMakeTeamLeaderEmailNotification(teamLeader, drawingPlanOrg)

      cy.logInTestCase('Reset Data: Remove team leader')
      orgUnitInfo.orgAdminAccessToMemberSubOrgUnit(drawingPlanOrg)
      manageMembers.removeTeamLeader(fullName)
      manageMembers.removeMember()
    })
  })
})
