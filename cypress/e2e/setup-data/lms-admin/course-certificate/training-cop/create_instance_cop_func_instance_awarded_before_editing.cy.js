import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setCourseCertificateYaml()
    SignInAs.orgAdmin_Amy()
  })

  context(Story.courseCertificate, () => {
    it('Setup instance "CoP Func Instance awarded certificate before editing certificate"', () => {
      setupInstance.setCourseBaseYaml('copCourseFuncEditExternalCertificate')
      setupInstance.setInstanceBaseYaml('copFuncInstanceAwardedBeforeEditing')

      setupInstance.createNewInstanceThenPublishFromManageCourse()
    })
  })
})
