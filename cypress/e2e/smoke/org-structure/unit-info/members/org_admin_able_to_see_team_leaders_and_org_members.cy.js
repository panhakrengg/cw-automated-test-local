import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ManageMembers from '../../../../../classes/org-management/org-structure/ManageMembers'

describe(Epic.OrgStructure, () => {
  context(Story.orgUnitManageMembers, () => {
    let manageMembers = new ManageMembers()

    beforeEach(() => {
      manageMembers.login.toRootOrgUnitManageMembersTabAsOrgAdmin()
    })

    it('Org Admin see list of team leaders and org members of root org', () => {
      Story.ticket('QA-2120')
      manageMembers.verifyTeamLeader()
      manageMembers.verifyMembers()
    })
  })
})
