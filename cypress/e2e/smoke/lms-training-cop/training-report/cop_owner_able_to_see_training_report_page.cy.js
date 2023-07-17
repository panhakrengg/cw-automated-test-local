import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import AdvancedFilter from '../../../../classes/lms/admin/training-report/AdvancedFilter'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import TrainingReportAssertion from '../../../../classes/lms/admin/training-report/TrainingReportAssertion'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const advancedFilter = new AdvancedFilter()
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const trainingReportAssertion = new TrainingReportAssertion()

  let trainingReport
  let columnHeaderNames
  let disabledColumnHeaderNames

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    disabledColumnHeaderNames = [
      'Name (Public Profile)',
      'Course Title',
      'Status',
      'Delivery Method',
    ]
    columnHeaderNames = ['Account Email', 'Completion Date'].concat(disabledColumnHeaderNames)
    SignInAs.copOwner()
  })

  context(Story.trainingReport, () => {
    it('CoP Owner able to see training report page', () => {
      Story.ticket('QA-1145')

      context('visit training report section', () => {
        trainingReport.visit()
      })

      context('expect to see training report overview', () => {
        trainingReportAssertion.expectToSeeColumnHeaders(columnHeaderNames)
        trainingReportAssertion.expectToSeeTrainingReportBaseTitle()
        trainingReportAssertion.expectToSeeBaseSearchBox()
        trainingReportAssertion.expectToSeeBaseExportButton()
        trainingReportAssertion.expectToSeeBaseAdvancedFilterButton()
      })

      context('expect to see disabled some column header in popup', () => {
        trainingReport.clickOnManageColumnIcon()
        trainingReportAssertion.expectToSeeDisableHeaderColumnInPopup(disabledColumnHeaderNames)
      })

      context('expect to see advanced filter section', () => {
        advancedFilter.clickOnAdvanceFilter()
        advancedFilter.expectToSeeInputWrapperElements()
        advancedFilter.expectToSeeSelectWrapperElements()
        advancedFilter.expectToSeeAdvanceFilterActionButton()
      })
    })
  })
})
