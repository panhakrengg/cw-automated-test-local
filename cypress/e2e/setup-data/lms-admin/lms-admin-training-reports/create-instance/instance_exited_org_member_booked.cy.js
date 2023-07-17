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
      'courseFullCatalog'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceExitedOrgMemberBooked
      activityObj = instanceObj.activities.tOActivityDocWarmUp
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance has learner as Exited org members with Booked status"', () => {
      SignInAs.learningAdminEmery()
      setupInstance.createNewInstanceThenPublishFromManageCourse(courseObj, instanceObj)
      new SetupInstancePeople().addUsers(instanceObj.managePeople.learners)
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activityObj)
    })
  })
})
