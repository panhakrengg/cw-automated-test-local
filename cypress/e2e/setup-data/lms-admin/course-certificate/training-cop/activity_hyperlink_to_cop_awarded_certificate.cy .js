import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import ManageCourse from '../../../../../classes/lms/admin/course/ManageCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  const setupActivity = new SetUpCourseActivity()
  const manageCourse = new ManageCourse()

  before(() => {
    setupActivity.setCourseCertificateYaml()
    manageCourse.setItcFetchManageCourse()

    SignInAs.orgAdmin_Amy()
  })

  context(Story.courseCertificate, () => {
    it('Setup activity "Beginner Tennis Lesson" to cop awarded certificate course', () => {
      setupActivity.setCourseBaseYaml('copCourseFuncEditExternalCertificate')
      setupActivity.setInstanceBaseYaml('copFuncInstanceAwardedBeforeEditing')

      cy.visit(setupActivity.getCoPCourseAdmin())
      manageCourse.waitItcFetchManageCourse()
      setupActivity.addActivityFromLibrary('beginnerTennisLesson')
    })
  })
})
