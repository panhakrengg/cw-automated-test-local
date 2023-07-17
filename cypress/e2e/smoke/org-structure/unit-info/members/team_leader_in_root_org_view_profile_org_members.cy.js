import Epic from '../../../../../classes/Epic'
import SpyOpenWindowEvent from '../../../../../classes/base/SpyOpenWindowEvent'
import ManageMembers from '../../../../../classes/org-management/org-structure/ManageMembers'

describe(Epic.OrgStructure, () => {
  const manageMembers = new ManageMembers()
  const spyOpenWindowEvent = new SpyOpenWindowEvent()
  const memberName = 'AUMember MemberRootOrg'

  context('View Organization member profile', () => {
    beforeEach(() => {
      manageMembers.login.toRootOrgUnitManageMembersTabAsTeamLeaderRootOrg()
      manageMembers.getRowData(memberName)
    })

    it('Root Org Team leader click link "view public profile" to view public profile', () => {
      manageMembers.viewPopupOrgProfile()
      spyOpenWindowEvent.setSpy()
      manageMembers.clickLinkViewPublicProfile()
      manageMembers.redirectToPublicProfile()
      manageMembers.expectedUserInRootOrg()
    })

    it('Root Org team leader click on member name to view public profile', () => {
      spyOpenWindowEvent.setSpy()
      manageMembers.clickUserName(memberName)
      manageMembers.redirectToPublicProfile()
      manageMembers.expectedUserInRootOrg()
    })
  })
})
