import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setWithdrawCoursesYaml()
    new SignInLmsAs().ctgAdmin_Kenton()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup instance "Instance for withdrawn and suppose to receive notification"', () => {
      setupInstance.setCourseBaseYaml('courseFuncWithdrawNotification')
      setupInstance.setInstanceBaseYaml('instanceWithdrawNotify')

      setupInstance.createNewInstanceThenPublishFromManageCourse()
    })
  })
})
