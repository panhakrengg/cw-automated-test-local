import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ManageMembers from '../../../../../classes/org-management/org-structure/ManageMembers'

describe(Epic.OrgStructure, () => {
  context(Story.orgUnitManageMembers, () => {
    let manageMembers = new ManageMembers()

    beforeEach(() => {
      manageMembers.login.toSubOrgUnitManageMembersTabAsTeamLeaderDesignFrontend()
    })

    it('Team Leader of sub org unit see list of team leaders and org members', () => {
      Story.ticket('QA-2121')
      manageMembers.verifyTeamLeader('AULeadFE LeaderFronted')
      manageMembers.verifyMembers(false)
    })
  })
})
