import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-instance')
      .read()
      .then(({ Courses }) => (courseObj = Courses.courseFuncInstanceLog))
  })

  context(Story.lmsChangeLogCourseInstance, () => {
    it('Create new course "Course func for instance to check log"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.categoryAdminKenton()
      setupCourse.createNewCourse()
      setupCourse.addAdmins()
      setupCourse.addFacilitators()
    })
  })
})
