import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setEnableCertificateYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup instance "Instance will award certificate"', () => {
      setupInstance.setCourseBaseYaml('progressOnEnableCertificate')
      setupInstance.setInstanceBaseYaml('instanceAwardCertificate')

      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
