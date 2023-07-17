import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import ManageCourse from '../../../../../classes/lms/admin/course/ManageCourse'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupActivity = new SetUpCourseActivity()
  const manageCourse = new ManageCourse()

  before(() => {
    setupActivity.setWithdrawCoursesYaml()
    manageCourse.setItcFetchManageCourse()

    new SignInLmsAs().ctgAdmin_Kenton(manageCourse.getManageCourseUrl())
    manageCourse.waitItcFetchManageCourse()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup activity "tOActivityReasonsWorkout" to instance', () => {
      setupActivity.setCourseBaseYaml('courseFuncWithdraw')
      setupActivity.setInstanceBaseYaml('instanceNewCourse')

      setupActivity.addActivityFromLibrary('tOActivityReasonsWorkout')
    })
  })
})
