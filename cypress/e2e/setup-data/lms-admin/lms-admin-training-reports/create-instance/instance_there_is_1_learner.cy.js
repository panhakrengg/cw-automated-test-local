import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, activityObj, learners

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseHaveAdminLearnerBooked'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceThereIs1Learner
      activityObj = instanceObj.activities.tOActivityDocWarmUp
      learners = instanceObj.managePeople.learners
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance which there is 1 learner"', () => {
      SignInAs.categoryAdminKenton()
      cy.log(instanceObj.managePeople.learners)
      new SetUpCourseInstance().createNewInstanceFromManageCourseThenAddPeople(
        courseObj,
        instanceObj
      )
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activityObj)
    })
  })
})
