import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import ManageCourse from '../../../../../classes/lms/admin/course/ManageCourse'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupActivity = new SetUpCourseActivity()
  const manageCourse = new ManageCourse()

  beforeEach(() => {
    setupActivity.setMixActivitiesYaml()
    manageCourse.setItcFetchManageCourse()

    new SignInLmsAs().ctgAdmin_Kenton(manageCourse.getManageCourseUrl())
    manageCourse.waitItcFetchManageCourse()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup activities "eLearning" to instance has elearning, file, feedback', () => {
      setupActivity.setCourseBaseYaml('progressOnMixActivities')
      setupActivity.setInstanceBaseYaml('instanceElearningFileFeedback')

      setupActivity.addActivityToLibrary('snapshotBlob')
    })
    it('Setup activities "eLearning" to instance has elearning, file, feedback', () => {
      setupActivity.addActivityFromLibrary('tOActivityImage')
    })

    it('Setup activities "feedback" to instance has elearning, file, feedback', () => {
      setupActivity.addActivityFromLibrary('tOActivityDoAfterCompleteCourse')
    })
  })
})
