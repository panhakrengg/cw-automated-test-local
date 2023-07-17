import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course-activity')
      .read()
      .then(({ EditActivities }) => {
        courseObj = EditActivities.courseActivitiesLog
        instanceObj = courseObj.instanceReorderLog
      })
  })

  context(Story.lmsChangeLogCourseActivities, () => {
    it('Setup instance "Instance reordering to check log"', () => {
      SignInAs.courseAdminGiles()
      new SetUpCourseInstance().createNewInstanceFromManageCourse(courseObj, instanceObj)
    })
  })
})
