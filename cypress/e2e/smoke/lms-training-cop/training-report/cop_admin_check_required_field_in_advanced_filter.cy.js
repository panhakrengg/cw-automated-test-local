import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import AdvancedFilter from '../../../../classes/lms/admin/training-report/AdvancedFilter'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const advancedFilter = new AdvancedFilter()
  let trainingReport

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    SignInAs.copAdmin()
  })

  context(Story.trainingReport, () => {
    it('CoP Admin check required field in advanced filter', () => {
      Story.ticket('QA-1152')

      context('visit training report section', () => {
        trainingReport.visit()
      })

      context('prepare data', () => {
        advancedFilter.clickOnAdvanceFilter()
        advancedFilter.checkLearnerNotBookCourse()
        advancedFilter.clickButtonApply()
      })

      context('expect to see required field', () => {
        advancedFilter.expectToSeeRequiredFieldOnSelectElement('Courses')
      })
    })
  })
})
