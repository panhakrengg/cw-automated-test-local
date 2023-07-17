import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course')
      .read()
      .then(({ ShareCourses }) => (courseObj = ShareCourses.defaultInstanceToSpecific))
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Create new course "Shared course set default instance to specific then check log"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.categoryAdminKenton()
      setupCourse.createNewCourseThenShare()
    })
  })
})