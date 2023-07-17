import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import TrainingReportAssertion from '../../../../classes/lms/admin/training-report/TrainingReportAssertion'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const trainingReportAssertion = new TrainingReportAssertion()

  let trainingReport

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    SignInAs.copContactManager()
  })

  context(Story.trainingReport, () => {
    it('Contact Manager will see page not found when access training report page', () => {
      Story.ticket('QA-1148', ['CW-16516'])

      context('visit training report section', () => {
        trainingReport.visit()
      })

      context('expect to see page not found', () => {
        trainingReportAssertion.expectToSeePageNotFound()
      })
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
