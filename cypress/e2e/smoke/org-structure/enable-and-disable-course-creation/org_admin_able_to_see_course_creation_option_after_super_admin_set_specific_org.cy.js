import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CourseCommunityCreation from '../../../../classes/org-management/org-structure/CourseCommunityCreation'
import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  const courseCommunityCreation = new CourseCommunityCreation()
  const orgUnitInfo = new OrgUnitInfo()

  context(Story.enableDisableCommunityCourseCreation, () => {
    beforeEach(() => {
      orgUnitInfo.login.asOrgAdmin()
    })
    it('Org Admin able to see course creation option after Super Admin set specific org', () => {
      Story.ticket('QA-364')
      courseCommunityCreation.enableCourseCreation()
      courseCommunityCreation.expectEnableCourseCreationPopup()
    })
  })
})
