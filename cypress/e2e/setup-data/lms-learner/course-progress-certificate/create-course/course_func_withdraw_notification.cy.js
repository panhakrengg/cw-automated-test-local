import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupCourse = new SetUpCourse()

  before(() => {
    setupCourse.setWithdrawCoursesYaml()
    new SignInLmsAs().ctgAdmin_Kenton()
  })

  context(Story.courseProgressCertificate, () => {
    it('Course Func for withdraw and check notification', () => {
      setupCourse.setCourseBaseYaml('courseFuncWithdrawNotification')

      setupCourse.createNewCourseThenPublish()
    })
  })
})
