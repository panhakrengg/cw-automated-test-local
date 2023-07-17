import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import ManageCourse from '../../../../../classes/lms/admin/course/ManageCourse'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupActivity = new SetUpCourseActivity()
  const manageCourse = new ManageCourse()

  before(() => {
    setupActivity.setCourseCertificateYaml()
    manageCourse.setItcFetchManageCourse()

    new SignInLmsAs().lnAdmin_Emery(manageCourse.getManageCourseUrl())
    manageCourse.waitItcFetchManageCourse()
  })

  context(Story.courseCertificate, () => {
    it('Setup activity "Beginner Tennis Lesson" to awarded certificate course', () => {
      setupActivity.setCourseBaseYaml('courseFuncEditDefaultCertificate')
      setupActivity.setInstanceBaseYaml('funcInstanceAwardedBeforeEditing')

      setupActivity.addActivityFromLibrary('beginnerTennisLesson')
    })
  })
})
