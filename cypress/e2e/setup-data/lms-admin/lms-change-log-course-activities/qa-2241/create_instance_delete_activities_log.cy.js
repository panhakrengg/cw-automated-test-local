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
      .then(({ DeleteActivities }) => {
        courseObj = DeleteActivities.courseActivitiesLog
        instanceObj = courseObj.instanceDeleteActivitiesLog
      })
  })

  context(Story.lmsChangeLogCourseActivities, () => {
    it('Setup instance "Instance for deleting activities"', () => {
      SignInAs.courseAdminGiles()
      new SetUpCourseInstance().createNewInstanceFromManageCourse(courseObj, instanceObj)
    })
  })
})
