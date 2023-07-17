import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    cy.stubCourse('lms-admin/lms-change-log/log-course-activity', 'courseActivitiesLog').then(
      (data) => (courseObj = data)
    )
  })

  context(Story.lmsChangeLogCourseActivities, () => {
    it('Create new course "Course Activities func log"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.categoryAdminKenton()
      setupCourse.createNewCourse()
      setupCourse.addAdmins()
    })
  })
})
