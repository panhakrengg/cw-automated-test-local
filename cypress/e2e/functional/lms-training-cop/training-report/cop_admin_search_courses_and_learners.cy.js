import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Environment from '../../../../classes/base/Environment'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import TrainingReportAssertion from '../../../../classes/lms/admin/training-report/TrainingReportAssertion'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const trainingReportAssertion = new TrainingReportAssertion()
  const learnerName = 'au_copmember'

  let trainingReport
  let courseTitle

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    trainingReportYamlStub.getCopCourseYaml((courseData) => {
      courseTitle = courseData.tennisByYourself.name
    })
  })

  after(() => {
    ReportDefect.markCwDefect('CW-17951 Cannot search report via Learner')
  })

  context(Story.trainingReport, () => {
    it('CoP Admin search courses and learners', () => {
      Story.ticket('QA-1149', ['CW-17951'])

      context('visit training report section', () => {
        SignInAs.copAdmin()
        trainingReport.visit()
      })

      context('search by course title', () => {
        trainingReport.search(`"${courseTitle}"`)
        trainingReportAssertion.expectToSeeCorrectSearchResult(courseTitle)
      })

      context('search by learner name', () => {
        trainingReport.search(learnerName)
        trainingReportAssertion.expectToSeeCorrectSearchResult(learnerName)
      })
    })
  })
})
