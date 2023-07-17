import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setRetakeCoursesYaml()
    new SignInLmsAs().ctgAdmin_Kenton()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup instance "Instance completed then retake"', () => {
      setupInstance.setCourseBaseYaml('courseFuncRetake')
      setupInstance.setInstanceBaseYaml('instanceCompleteRetake')

      setupInstance.createNewInstanceThenPublishFromManageCourse()
    })
  })
})
