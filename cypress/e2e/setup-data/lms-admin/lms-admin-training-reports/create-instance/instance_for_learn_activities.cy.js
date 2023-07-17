import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, activities
  const setupInstance = new SetUpCourseInstance()
  const setUpCourseActivity = new SetUpCourseActivity()

  beforeEach(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseFuncForReport'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceForLearnActivities
      activities = instanceObj.activities
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance for learning some activities"', () => {
      SignInAs.categoryAdminKenton()
      setupInstance.createNewInstanceFromManageCourse(courseObj, instanceObj)
      new SetupInstancePeople().addUsers(instanceObj.managePeople.learners)
      setUpCourseActivity.addActivityFromLibraryByStandingOnInstance(activities.tOActivityDocWarmUp)
    })
  })
})
