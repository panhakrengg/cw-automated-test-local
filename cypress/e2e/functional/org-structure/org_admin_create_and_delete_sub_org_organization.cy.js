import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import OrgUnitInfo from '../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  let orgUnitInfo = new OrgUnitInfo()
  let newCompany

  before(() => {
    orgUnitInfo.stub.getNewCompany((data) => {
      newCompany = data
    })
  })

  context(Story.unitInfo, () => {
    it('Org Admin create and delete Sub Org - Organization', () => {
      Story.ticket('QA-346')
      orgUnitInfo.login.asOrgAdmin()
      orgUnitInfo.createAndDeleteSubOrg(newCompany)
    })
  })
})
