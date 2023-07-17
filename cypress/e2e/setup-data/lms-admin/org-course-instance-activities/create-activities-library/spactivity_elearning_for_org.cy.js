import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    setupActivityLibrary.setOrgInstanceActivityYaml()
    setupActivityLibrary.itcSearchActivityLibrary.set()

    new SignInLmsAs().lnAdmin_Cw(setupActivityLibrary.getActivityLibraryCwUrl())
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup elearning activity "SPActivity elearning for org - 4 Slide Only"', () => {
      setupActivityLibrary.setElearningObject('sPActivityElearningOrg')

      setupActivityLibrary.createElearning()
    })
  })
})
