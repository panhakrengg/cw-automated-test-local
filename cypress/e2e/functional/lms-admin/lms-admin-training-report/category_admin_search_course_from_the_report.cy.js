import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'

describe(Epic.LmsAdmin, () => {
  const { actions, assertions, constantColumnByRole, login, yaml } = new TrainingReportsBase()
  const defaultColumns = constantColumnByRole.CATEGORY_ADMIN

  let courseNoLearnerName, totalCourseNoLearner
  let courseHasLearnerName, totalCourseHasLearner
  let instanceThereAre2Learners, instanceThereIs1Learner

  before(() => {
    yaml.getSearchInReport((data) => {
      const courseHasLearner = data.courseHasLearner
      courseHasLearnerName = courseHasLearner.name
      totalCourseHasLearner = courseHasLearner.totalRecordAtLeast
      instanceThereIs1Learner = courseHasLearner.instanceThereIs1Learner
      instanceThereAre2Learners = courseHasLearner.instanceThereAre2Learners

      const courseNoLearner = data.courseNoLearner
      courseNoLearnerName = courseNoLearner.name
      totalCourseNoLearner = courseNoLearner.totalRecordAtLeast
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Category admin search course from the report', () => {
      Story.ticket('QA-1831')

      login.toTopLevelAsCategoryAdminKenton()

      cy.logInTestCase('2.a course has learners')
      actions.searchCoursesLearners(`"${courseHasLearnerName}"`)
      assertions.expectColumnHeaders(defaultColumns)
      assertions.expectRecordEqualToSearchResult()
      assertions.expectSearchResultLabel(`"${courseHasLearnerName}"`)
      assertions.expectTotalRecordAtLeast(totalCourseHasLearner)
      assertions.expectRecordWithInstanceInfo(instanceThereIs1Learner)
      assertions.expectRecordWithInstanceInfo(instanceThereAre2Learners)

      cy.logInTestCase('2.b course no learners')
      actions.searchCoursesLearners(`"${courseNoLearnerName}"`)
      assertions.expectColumnHeaders(defaultColumns)
      assertions.expectSearchResultLabel(`"${courseNoLearnerName}"`)
      assertions.expectNoRecord()
    })
  })
})
