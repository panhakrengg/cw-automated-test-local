import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import TrainingReportAssertion from '../../../../classes/lms/admin/training-report/TrainingReportAssertion'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const trainingReportAssertion = new TrainingReportAssertion()

  let trainingReport
  let sortColumnHeaderNames

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    sortColumnHeaderNames = ['Course Title', 'Status', 'Delivery Method']
    SignInAs.copAdmin()
  })

  context(Story.trainingReport, () => {
    it('CoP Admin sort filter report', () => {
      Story.ticket('QA-1153')

      context('visit training report section', () => {
        trainingReport.visit()
      })

      context('expect to see sort ion on column header', () => {
        trainingReportAssertion.expectToSeeSortIconOnColumnHeaders(sortColumnHeaderNames)
      })

      context('sort course title column name by ascending', () => {
        trainingReport.clickOnTableHeader('Course Title')
        trainingReportAssertion.expectToSortByAscending()
      })

      context('sort course title column name by descending', () => {
        trainingReport.clickOnTableHeader('Course Title')
        trainingReportAssertion.expectToSortByDescending()
      })
    })
  })
})
