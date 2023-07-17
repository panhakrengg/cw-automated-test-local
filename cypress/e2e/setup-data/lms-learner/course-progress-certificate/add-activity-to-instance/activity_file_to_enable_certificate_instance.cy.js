import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import ManageCourse from '../../../../../classes/lms/admin/course/ManageCourse'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupActivity = new SetUpCourseActivity()
  const manageCourse = new ManageCourse()

  before(() => {
    setupActivity.setEnableCertificateYaml()
    manageCourse.setItcFetchManageCourse()

    new SignInLmsAs().lnAdmin_Emery(manageCourse.getManageCourseUrl())
    manageCourse.waitItcFetchManageCourse()
  })

  context(Story.courseProgressCertificate, () => {
    it('Setup activity "tOActivityDocWarmUp" to instance', () => {
      setupActivity.setCourseBaseYaml('progressOnEnableCertificate')
      setupActivity.setInstanceBaseYaml('instanceAwardCertificate')

      setupActivity.addActivityFromLibrary('tOActivityDocWarmUp')
    })
  })
})
