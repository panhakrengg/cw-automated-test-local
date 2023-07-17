import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setCourseCertificateYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseCertificate, () => {
    it('Setup instance "Func Instance awarded certificate before editing certificate"', () => {
      setupInstance.setCourseBaseYaml('courseFuncEditDefaultCertificate')
      setupInstance.setInstanceBaseYaml('funcInstanceAwardedBeforeEditing')

      setupInstance.createNewInstanceThenPublishFromManageCourse()
    })
  })
})
