import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import OrgUnitInfo from '../../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  let orgUnitInfo = new OrgUnitInfo()

  beforeEach(() => {
    orgUnitInfo.login.asOrgAdmin()
  })

  context(Story.storyUnitInfo, () => {
    it('Org Admin able to see communities section and create a community', () => {
      Story.ticket('QA-434')
      describe('see list communities', () => {
        orgUnitInfo.verifyCommunitiesSection()
      })

      describe('create a new community', () => {
        orgUnitInfo.verifyCouldCreateCop()
      })
    })
  })
})
