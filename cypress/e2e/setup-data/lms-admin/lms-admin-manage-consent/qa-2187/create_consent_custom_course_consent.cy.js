import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpConsent from '../../../../../classes/lms/admin/setup-data/SetUpConsent'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseName, consent

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-manage-consent/course-consent',
      'courseForEditingConsent'
    ).then((course) => {
      courseName = course.name
      consent = course.manageConsent.customCourseConsent
    })
  })

  context(Story.lmsAdminManageConsent, () => {
    it('Create consent "Custom course consent"', () => {
      SignInAs.courseAdminTressie()
      new SetUpConsent().searchCourseThenCreateConsent(courseName, consent)
    })
  })
})
