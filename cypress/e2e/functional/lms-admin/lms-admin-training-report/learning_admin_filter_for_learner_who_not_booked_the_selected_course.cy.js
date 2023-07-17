import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Environment from '../../../../classes/base/Environment'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'

describe(Epic.LmsAdmin, () => {
  const { yaml, login, actions, assertions } = new TrainingReportsBase()
  const env = new Environment()

  let course, courseName, totalRecordAtLeast
  let nonOrgMembers, learnersBookedCourse

  before(() => {
    yaml.getShowLearnersWhoNotBookCourseHaveAdminLearnerBooked((data) => {
      course = data
      courseName = data.courseName
      totalRecordAtLeast = data.totalRecordAtLeast
      nonOrgMembers = data.nonOrgMembers[env.getEnvYaml()]
      learnersBookedCourse = data.learners[env.getEnvYaml()]
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Learning admin filter for learner who not booked the selected course', () => {
      Story.ticket('QA-1834')

      login.toTopLevelAsLearningAdmin()

      cy.logInTestCase('Fill advanced filter')
      actions.clickNavButtonAdvancedFilters()
      actions.fillAdvancedFilter(course)
      actions.applyFilter()
      actions.select75ItemsPerPage()

      cy.logInTestCase('All org members who not book the course will show in report')
      assertions.expectTotalRecordAtLeast(totalRecordAtLeast)
      assertions.expectRecordWithCourseInfo(courseName)
      assertions.expectNotSeeRecord(nonOrgMembers)
      assertions.expectNotSeeRecord(learnersBookedCourse)
    })
  })
})
