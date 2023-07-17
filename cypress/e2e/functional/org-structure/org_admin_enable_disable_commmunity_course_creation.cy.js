import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import ManageCommunity from '../../../classes/cop/ManageCommunity'
import { OrgConst } from '../../../classes/org-management/base-org-management/OrgStub'
import CourseCommunityCreation from '../../../classes/org-management/org-structure/CourseCommunityCreation'
import OrgUnitInfo from '../../../classes/org-management/org-structure/OrgUnitInfo'
import SignInAs from '../../../classes/utilities/SignInAs'
import YamlHelper from '../../../classes/utilities/YamlHelper'

describe(Epic.OrgStructure, () => {
  let newOrgUnitName
  const courseCommunityCreation = new CourseCommunityCreation()
  const orgUnitInfo = new OrgUnitInfo()
  before(() => {
    new YamlHelper('community-course-creation')
      .read()
      .its('EnableDisableCommunityCourseCreation.organizationStructure.webLearnInternational')
      .then((webLearnOrg) => {
        newOrgUnitName = webLearnOrg.subOrgUnit.new.name
      })
  })

  context(Story.enableDisableCommunityCourseCreation, () => {
    it('Verify course creation is disabled by default when create org unit', () => {
      orgUnitInfo.login.asOrgAdmin()
      courseCommunityCreation.createSubOrganization(newOrgUnitName)
      courseCommunityCreation.accessToRootOrganization()
      courseCommunityCreation.expectCourseCreateShouldDisableByDefault(newOrgUnitName)
      courseCommunityCreation.deleteOrgUnit(newOrgUnitName)
    })
  })
})
