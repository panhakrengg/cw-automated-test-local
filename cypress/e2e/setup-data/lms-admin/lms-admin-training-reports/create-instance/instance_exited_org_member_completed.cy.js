import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, activityObj, userEmail
  const setupInstance = new SetUpCourseInstance()
  const setupInstancePeople = new SetupInstancePeople()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseFullCatalog'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceExitedOrgMemberCompleted
      activityObj = instanceObj.activities.tOActivityDocWarmUp
    })
    cy.stubUser(UserRole.ORG_MEMBER.EXIT_SIMO).then((data) => {
      userEmail = data.email
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance has learner as Exited org members with Completed status"', () => {
      SignInAs.learningAdminEmery()
      setupInstance.createNewInstanceThenPublishFromManageCourse(courseObj, instanceObj)
      setupInstancePeople.addUsers(instanceObj.managePeople.learners)
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activityObj)
    })
  })
})
