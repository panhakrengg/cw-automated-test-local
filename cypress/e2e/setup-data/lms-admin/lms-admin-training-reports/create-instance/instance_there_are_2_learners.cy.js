import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, activityObj

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseHaveAdminLearnerBooked'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceThereAre2Learners
      activityObj = instanceObj.activities.tOActivityDocWarmUp
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance which there are 2 learners"', () => {
      SignInAs.categoryAdminKenton()
      new SetUpCourseInstance().createNewInstanceThenPublishFromManageCourse(courseObj, instanceObj)
      new SetupInstancePeople().addUsers(instanceObj.managePeople.learners)
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activityObj)
    })
  })
})
