import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import OrgUnitInfo from '../../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  const orgUnitInfo = new OrgUnitInfo()

  beforeEach(() => {
    orgUnitInfo.login.asOrgAdmin()
  })

  context(Story.storyUnitInfo, () => {
    it('Org Admin able to see the list sub org unit from root org unit', () => {
      Story.ticket('QA-1369')
      orgUnitInfo.verifySubOrgSection()
      orgUnitInfo.verifyCreateNewSubOrg()
    })
  })
})
