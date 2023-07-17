import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, activityObj
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseSharedForCheckingTrainingReport'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceCoPLearnerBooked
      activityObj = instanceObj.activities.tOActivityDocWarmUp
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance CoP learners booked"', () => {
      SignInAs.courseAdminTressie()
      setupInstance.createNewInstanceThenPublishFromManageCourse(courseObj, instanceObj)
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activityObj)
    })
  })
})
