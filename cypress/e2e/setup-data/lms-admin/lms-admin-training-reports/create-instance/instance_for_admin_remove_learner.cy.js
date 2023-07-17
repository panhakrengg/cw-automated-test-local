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
      'courseFuncForReport'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceForAdminRemoveLearner
      activityObj = instanceObj.activities.tOActivityDocWarmUp
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance for admin remove learner"', () => {
      SignInAs.categoryAdminKenton()
      setupInstance.createNewInstanceFromManageCourse(courseObj, instanceObj)
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activityObj)
    })
  })
})
