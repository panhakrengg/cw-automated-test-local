import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    cy.stubCourse('lms-admin/lms-change-log/log-course', 'courseConsentNewResourceLog').then(
      (course) => (courseObj = course)
    )
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Create new course "Course func for consent & new resources to check log"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.learningAdminEmery()
      setupCourse.createNewCourse()
    })
  })
})
