import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import ManageCourse from '../../../../../classes/lms/admin/course/ManageCourse'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupActivity = new SetUpCourseActivity()
  const manageCourse = new ManageCourse()

  before(() => {
    setupActivity.setOrgActivityLibraryYaml()
    manageCourse.setItcFetchManageCourse()

    new SignInLmsAs().lnAdmin_Emery(manageCourse.getManageCourseUrl())
    manageCourse.waitItcFetchManageCourse()
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup activity "tOActivityAssignmentEdit" to instance', () => {
      setupActivity.setCourseBaseYaml('courseFuncActivityFromLibrary')
      setupActivity.setInstanceBaseYaml('funEditAssignmentActivity')

      setupActivity.addActivityFromLibrary('tOActivityAssignmentEdit')
    })
  })
})
