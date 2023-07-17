import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setMixActivitiesYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup instance "Instance has elearning, file, feedback"', () => {
      setupInstance.setCourseBaseYaml('progressOnMixActivities')
      setupInstance.setInstanceBaseYaml('instanceElearningFileFeedback')

      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
