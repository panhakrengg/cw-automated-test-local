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
      .then(({ EditCourse }) => (courseObj = EditCourse.courseForEditInfoLog.previous))
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Create new course "Course for edit info to check Log"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.learningAdminEmery()
      setupCourse.createNewCourse()
    })
  })
})
