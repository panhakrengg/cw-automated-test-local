import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import TrainingReportAssertion from '../../../../classes/lms/admin/training-report/TrainingReportAssertion'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const courseStartDateColumnHeaderName = 'Course Start Date'
  const trainingReportAssertion = new TrainingReportAssertion()

  let trainingReport
  let columnHeaderNames

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    columnHeaderNames = [
      'Name (Public Profile)',
      'Account Email',
      'Course Title',
      'Status',
      'Delivery Method',
      'Completion Date',
    ]
    SignInAs.copAdmin()
  })

  context(Story.trainingReport, () => {
    it('CoP Admin can manage column on the table', () => {
      Story.ticket('QA-1150')

      context('visit training report section', () => {
        trainingReport.visit()
      })

      context('add new table column', () => {
        trainingReport.clickOnManageColumnIcon()
        trainingReport.addNewTableColumn(courseStartDateColumnHeaderName)
      })

      context('expect to see course start date column after added', () => {
        columnHeaderNames.push(courseStartDateColumnHeaderName)
        trainingReportAssertion.expectToSeeColumnHeaders(columnHeaderNames)
      })

      context('remove table column', () => {
        trainingReport.clickOnManageColumnIcon()
        trainingReport.removeTableColumn(courseStartDateColumnHeaderName)
      })

      context('expect not to see course start date column after removed', () => {
        columnHeaderNames.pop()
        trainingReportAssertion.expectNotToSeeColumnHeader(courseStartDateColumnHeaderName)
        trainingReportAssertion.expectToSeeColumnHeaders(columnHeaderNames)
      })
    })
  })
})
