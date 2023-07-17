import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import OrgUnitInfo from '../../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  let orgUnitInfo = new OrgUnitInfo(false)

  beforeEach(() => {
    orgUnitInfo.login.toSubOrgUnitAsTeamLeaderRootOrg()
  })

  context(Story.storyUnitInfo, () => {
    it('Team Leader Access sub org "Design Frontend" from Root Org', () => {
      orgUnitInfo.verifyOrgUnitInfoPanel()
    })
  })
})
