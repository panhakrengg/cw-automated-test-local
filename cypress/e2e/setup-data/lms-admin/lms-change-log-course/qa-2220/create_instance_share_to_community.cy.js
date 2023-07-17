import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course').read().then(({ ShareCourses }) => {
      courseObj = ShareCourses.defaultInstanceToAll
      instanceObj = courseObj.instanceToShare
    })
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Setup instance "Instance share to community"', () => {
      SignInAs.categoryAdminKenton()
      new SetUpCourseInstance().createNewInstanceThenPublishFromManageCourse(courseObj, instanceObj)
    })
  })
})
