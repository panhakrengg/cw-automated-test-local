import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import GlobalMenu from '../../../../classes/global-menu/GlobalMenu'
import WebNotification from '../../../../classes/notification/WebNotification'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

let screenName, email, fullName, teamLeader, teamLeaderRootOrg

describe(Epic.OrgStructure, () => {
  const orgUnitInfo = new OrgUnitInfo()
  const manageMembers = new ManageMembers()
  const globalMenu = new GlobalMenu()
  const webNotification = new WebNotification()
  const rootOrg = OrgConst.ROOT_ORG_NAME

  before(() => {
    cy.stubUser(UserRole.ROOT_ORG_UNIT.TEAM_LEADER_WI)
    cy.get('@stubUser').then((user) => {
      teamLeader = user
      fullName = user.fullName
      email = user.email
      screenName = user.screenName
    })
    cy.stubUser(UserRole.ROOT_ORG_UNIT.TEAM_LEADERS)
    cy.get('@stubUser').then((user) => {
      teamLeaderRootOrg = user
    })
  })

  context(ManageMembers.storyAddRemoveMemberAndTeamLeader, () => {
    it('Team Leader can add/edit/remove members and make/remove Team Leader from Root Org', () => {
      Story.ticket('QA-78')
      SignInAs.teamLeaderRootOrgUnit(orgUnitInfo.urlOrgStructure())

      cy.logInTestCase('Reset Data: Clean up existing users')
      manageMembers.initAliasMembersSection()
      manageMembers.accessManageMembersTab()
      manageMembers.cleanUpExistingUser(email)

      cy.logInTestCase('Add members')
      manageMembers.addNewMemberByScreenName(screenName)
      manageMembers.initARowMemberByEmail(email)
      manageMembers.verifyMemberColumn(teamLeader)

      cy.logInTestCase('Edit & mark as Team Leader')
      manageMembers.editMember()
      manageMembers.verifyMemberColumn(teamLeader, true, true)
      manageMembers.makeMemberAsTeamLeader(email)

      cy.logInTestCase('New Team leader root org access the permission')
      SignInAs.teamLeaderRootOrgUnitWi(orgUnitInfo.urlOrgStructure())
      webNotification.show()
      webNotification.seeAssignAsTeamLeader(teamLeaderRootOrg.screenName, rootOrg, true)
      manageMembers.verifyMakeTeamLeaderEmailNotification(teamLeader, rootOrg)

      cy.logInTestCase('Reset Data: Team leader root remove a new team leader')
      SignInAs.teamLeaderRootOrgUnit(orgUnitInfo.urlOrgStructure())
      manageMembers.accessManageMembersTab()
      manageMembers.removeTeamLeader(fullName)
      manageMembers.removeMember()
    })
  })
})
