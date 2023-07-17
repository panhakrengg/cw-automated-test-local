import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setDisableCertificateYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup instance "Instance not award certificate"', () => {
      setupInstance.setCourseBaseYaml('progressOnDisableCertificate')
      setupInstance.setInstanceBaseYaml('instanceNotAwardCertificate')

      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
