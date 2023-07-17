import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import CourseList from '../../../../../classes/lms/admin/setup-data/CourseList'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  let instanceName, userEmail
  const setupInstance = new SetUpCourseInstance()
  const setupInstancePeople = new SetupInstancePeople()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseFullCatalog'
    ).then((course) => {
      instanceName = course.instanceExitedOrgMemberCompleted.title
    })
    cy.stubUser(UserRole.ORG_MEMBER.EXIT_SIMO).then((data) => {
      userEmail = data.email
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Change course status "Simo" to completed', () => {
      SignInAs.learningAdminEmery(setupInstance.manageCourse.getManageCourseUrl())
      new CourseList().goToInstancePeopleFromCourseList(instanceName)
      setupInstancePeople.changeStatus(userEmail, 'Completed')
    })
  })
})
