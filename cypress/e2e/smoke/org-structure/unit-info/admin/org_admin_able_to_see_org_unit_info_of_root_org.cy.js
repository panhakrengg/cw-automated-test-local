import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import OrgUnitInfo from '../../../../../classes/org-management/org-structure/OrgUnitInfo'
import ReportDefect from '../../../../../classes/utilities/ReportDefect'

describe(Epic.OrgStructure, () => {
  let orgUnitInfo = new OrgUnitInfo()

  beforeEach(() => {
    orgUnitInfo.login.asOrgAdmin()
  })

  after(() => {
    ReportDefect.markAsUATCwDefect('CW-18147: Wait new implementation deploy to UAT')
  })

  context(Story.storyUnitInfo, () => {
    it('Org Admin able to see org unit info panel of root org', () => {
      Story.ticket('QA-2119')
      orgUnitInfo.verifyOrgUnitInfoPanel()
      orgUnitInfo.verifyOrgUnitHeaderInfo()
      orgUnitInfo.verifyOrgUnitBodyLeftInfo()
      orgUnitInfo.verifyOrgUnitBodyRightInfo()
    })
  })
})
