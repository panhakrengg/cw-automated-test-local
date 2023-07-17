import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import OrgUnitInfo from '../../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  let subOrgUnitInfo = new OrgUnitInfo(false)

  beforeEach(() => {
    subOrgUnitInfo.login.toSubOrgUnitAsTeamLeaderDesignFrontend()
  })

  context(Story.storyUnitInfo, () => {
    it('Team Leader Access sub org "Design Frontend" from Sub Org', () => {
      Story.ticket('QA-1234')
      describe('See list of sub org unit then click edit shows popup', () => {
        subOrgUnitInfo.verifySubOrgSection()
      })
      describe('Click Create New Sub Org', () => {
        subOrgUnitInfo.verifyCreateNewSubOrg()
      })
    })
  })
})
