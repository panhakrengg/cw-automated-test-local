import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-training-reports/training-reports',
      'courseSharedForCheckingTrainingReport'
    ).then((course) => {
      courseObj = course
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Course Shared for Checking Training Reports', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.categoryAdminKenton()
      setupCourse.createNewCourseThenPublish()
      setupCourse.addAdmins()
      setupCourse.addFacilitators()
    })
  })
})
