import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    cy.stubCourse('lms-admin/lms-change-log/log-course', 'courseSharingDeleteResourceLog').then(
      (course) => (courseObj = course)
    )
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Create new course "Course func for sharing and delete recourse to check log"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.learningAdminEmery()
      setupCourse.createNewCourse()
    })
  })
})
