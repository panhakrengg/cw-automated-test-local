import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { actions, assertions, constantColumnByRole, login, yaml } = new TrainingReportsBase()
  const defaultColumns = constantColumnByRole.LEARNING_ADMIN

  let learner, screenName, givenName, expectTotalRecord, course

  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LN_CTG_MEM_QUESTIN).then((user) => {
      learner = user
      screenName = user.screenName
      givenName = user.givenName
    })
    yaml.getSearchInReport((data) => {
      course = data.learnerQuentin.courses.courseHaveAdminLearnerBooked
      expectTotalRecord = course.totalRecordAtLeast
    })
  })

  const verifySearchLearner = (searchKeyword) => {
    assertions.expectColumnHeaders(defaultColumns)
    assertions.expectSearchResultLabel(searchKeyword)
    assertions.expectTotalRecordAtLeast(expectTotalRecord)
    assertions.expectRecordWithLearnerAndCourseInfo(learner, course)
  }

  context(Story.lmsAdminTrainingReports, () => {
    it('Learning admin search learner from the report', () => {
      Story.ticket('QA-1916')

      login.toTopLevelAsLearningAdmin()

      cy.logInTestCase('2.a searching by screen name')
      actions.searchCoursesLearners(screenName)
      verifySearchLearner(screenName)

      cy.logInTestCase('2.b searching by given name')
      actions.searchCoursesLearners(givenName)
      verifySearchLearner(givenName)
    })
  })
})
