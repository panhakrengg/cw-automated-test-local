import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CourseCommunityCreation from '../../../../classes/org-management/org-structure/CourseCommunityCreation'
import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  const courseCommunityCreation = new CourseCommunityCreation()
  const orgUnitInfo = new OrgUnitInfo()
  context(Story.enableDisableCommunityCourseCreation, () => {
    beforeEach(() => {
      orgUnitInfo.login.asTeamLeaderRootOrg()
    })

    it('Team Leader can not see enable/disable course creation', () => {
      Story.ticket('QA-370')
      courseCommunityCreation.expectNotToSeeEnableCourseCreationOption()
    })
  })
})
