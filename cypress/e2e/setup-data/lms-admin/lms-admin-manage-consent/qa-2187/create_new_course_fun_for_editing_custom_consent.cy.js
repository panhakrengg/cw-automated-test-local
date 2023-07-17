import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-manage-consent/course-consent',
      'courseForEditingConsent'
    ).then((course) => {
      courseObj = course
    })
  })

  context(Story.lmsAdminManageConsent, () => {
    it('Create new course "Course func for editing consent"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.learningAdminEmery()
      setupCourse.createNewCourseThenPublish()
      setupCourse.addAdmins()
    })
  })
})
