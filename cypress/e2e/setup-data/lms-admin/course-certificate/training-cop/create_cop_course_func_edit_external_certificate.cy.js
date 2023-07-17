import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  const setupCourse = new SetUpCourse()

  before(() => {
    setupCourse.setCourseCertificateYaml()
  })

  context(Story.courseCertificate, () => {
    it('CoP Course Func for edit External Certificate', () => {
      SignInAs.orgAdmin_Amy()
      setupCourse.setCourseBaseYaml('copCourseFuncEditExternalCertificate')

      setupCourse.createNewCourseThenPublish()
    })
  })
})
