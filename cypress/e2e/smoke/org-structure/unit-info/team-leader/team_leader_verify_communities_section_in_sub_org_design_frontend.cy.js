import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import OrgUnitInfo from '../../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  let subOrgUnitInfo = new OrgUnitInfo(false)

  beforeEach(() => {
    subOrgUnitInfo.login.toSubOrgUnitAsTeamLeaderDesignFrontend()
  })

  context(Story.storyUnitInfo, () => {
    it('Team Leader Verify communities section in sub org "Design Frontend"', () => {
      Story.ticket('QA-708')
      describe('see list communities', () => {
        subOrgUnitInfo.verifyCommunitiesSection()
      })

      describe('create a new community', () => {
        subOrgUnitInfo.verifyCouldCreateCop()
      })
    })
  })
})
