import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Environment from '../../../../classes/base/Environment'
import AdvancedFilter from '../../../../classes/lms/admin/training-report/AdvancedFilter'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import TrainingReportAssertion from '../../../../classes/lms/admin/training-report/TrainingReportAssertion'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const trainingReportAssertion = new TrainingReportAssertion()
  const advancedFilter = new AdvancedFilter()

  let trainingReport
  let courseTitle

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    trainingReportYamlStub.getCopCourseYaml((courseData) => {
      courseTitle = courseData.onlineTraining.name
    })
    SignInAs.copAdmin()
  })

  after(() => {
    ReportDefect.markCwDefect('CW-18355: Cannot filter learner who not booked the course')
  })

  context(Story.trainingReport, () => {
    it('CoP Admin filter members who have not booked the selected course', () => {
      Story.ticket('QA-1151', ['CW-18355'])

      context('visit training report section', () => {
        trainingReport.visit()
      })

      context('filter by course :Online Training', () => {
        advancedFilter.clickOnAdvanceFilter()
        advancedFilter.openCourseFilter()
        advancedFilter.filterCourseByName(courseTitle)
        advancedFilter.checkLearnerNotBookCourse()
        advancedFilter.clickOnButtonApplyFilter()
      })

      context('expect to see correct result filter', () => {
        trainingReportAssertion.expectToSeeCorrectSearchResult(courseTitle)
      })
    })
  })
})
