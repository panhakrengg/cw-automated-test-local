import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpConsent from '../../../../../classes/lms/admin/setup-data/SetUpConsent'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, consent
  const setupCourse = new SetUpCourse()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-manage-consent/course-consent',
      'courseForDownloadingConsent'
    ).then((course) => {
      courseObj = course
      consent = course.manageConsent.customCourseConsent
    })
  })

  context(Story.lmsAdminManageConsent, () => {
    it('Create new course "Course func for downloading consent"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.learningAdminEmery()
      setupCourse.createNewCourseThenPublish()
      setupCourse.addAdmins()
      new SetUpConsent().clickManageConsentThenCreate(consent)
    })
  })
})
