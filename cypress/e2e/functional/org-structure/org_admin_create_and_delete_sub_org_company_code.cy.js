import Epic from '../../../classes/Epic'
import OrgUnitInfo from '../../../classes/org-management/org-structure/OrgUnitInfo'
import Story from '../../../classes/Story'

describe(Epic.OrgStructure, () => {
  let orgUnitInfo = new OrgUnitInfo()
  let newCompany

  context(Story.unitInfo, () => {
    before(() => {
      orgUnitInfo.stub.getNewCompany((data) => {
        newCompany = data
      })
    })

    it('Org Admin create and delete sub org - Company Code', () => {
      Story.ticket('QA-1977')
      orgUnitInfo.login.asOrgAdmin()
      orgUnitInfo.createAndDeleteSubOrg(newCompany)
    })
  })
})
