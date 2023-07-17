import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, activityObj
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseFuncForReport'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceForCompleted
      activityObj = instanceObj.activities.beginnerTennisLesson
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance for completed"', () => {
      SignInAs.categoryAdminKenton()
      setupInstance.createNewInstanceFromManageCourse(courseObj, instanceObj)
      new SetupInstancePeople().addUsers(instanceObj.managePeople.learners)
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activityObj)
    })
  })
})
