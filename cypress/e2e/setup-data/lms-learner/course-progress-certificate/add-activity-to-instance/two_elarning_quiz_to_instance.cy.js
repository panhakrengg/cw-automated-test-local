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
    it('Setup activities "first eLearning" to instance has 2 elearning and quiz', () => {
      setupActivity.setCourseBaseYaml('progressOnMixActivities')
      setupActivity.setInstanceBaseYaml('instanceTwoElearningQuiz')

      setupActivity.addActivityToLibrary('snapshotBlob')
    })
    it('Setup activities "second eLearning" to instance has 2 elearning and quiz', () => {
      setupActivity.addActivityToLibrary('Living')
    })

    it('Setup activities "quiz" to instance has 2 elearning and quiz', () => {
      setupActivity.addActivityFromLibrary('toActivityQuizOneQuestion')
    })
  })
})
