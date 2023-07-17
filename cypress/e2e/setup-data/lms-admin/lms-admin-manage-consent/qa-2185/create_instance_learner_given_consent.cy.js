import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, learners
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-manage-consent/course-consent',
      'courseForDownloadingConsent'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceLearnerGivenConsent
      learners = instanceObj.managePeople.learners
    })
  })

  context(Story.lmsAdminManageConsent, () => {
    it('Setup instance "Instance Learner given consent"', () => {
      SignInAs.courseAdminTressie()
      setupInstance.createNewInstanceThenPublishFromManageCourse(courseObj, instanceObj)
      new SetupInstancePeople().addUsers(learners)
    })
  })
})
