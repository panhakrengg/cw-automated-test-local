import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseFullCatalog'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceSmokeLearnerChangeEmail
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup instance "Instance smoke has learner that change email"', () => {
      SignInAs.learningAdminEmery()
      setupInstance.createNewInstanceFromManageCourse(courseObj, instanceObj)
      new SetupInstancePeople().addUsers(instanceObj.managePeople.learners)
    })
  })
})
