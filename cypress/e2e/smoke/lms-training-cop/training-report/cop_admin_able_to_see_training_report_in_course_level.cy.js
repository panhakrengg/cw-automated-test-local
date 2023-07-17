import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import AdvancedFilter from '../../../../classes/lms/admin/training-report/AdvancedFilter'
import TrainingReportYamlStub from '../../../../classes/lms/admin/training-report/stub/TrainingReportYamlStub'
import TrainingReport from '../../../../classes/lms/admin/training-report/TrainingReport'
import TrainingReportAssertion from '../../../../classes/lms/admin/training-report/TrainingReportAssertion'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const advancedFilter = new AdvancedFilter()
  const copManageCourse = new CopManageCourse()
  const trainingReport = new TrainingReport()
  const trainingReportYamlStub = new TrainingReportYamlStub()
  const trainingReportAssertion = new TrainingReportAssertion()

  let columnHeaderNames

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      copManageCourse.setCopAdminUrl(learnTennis.url[new Environment().getEnvYaml()])
    })
    trainingReportYamlStub.getCopCourseYaml((courseData) => {
      copManageCourse.setCourse(courseData.tennisByYourself)
    })
    columnHeaderNames = ['Name (Public Profile)', 'Account Email', 'Status', 'Completion Date']
    SignInAs.learningAdmin()
  })

  context(Story.trainingReport, () => {
    it('CoP Admin able to see training report in course level', () => {
      Story.ticket('QA-934')

      context('Visit Cop Manage Course section', () => {
        copManageCourse.visitManageCourse({ failOnStatusCode: false })
      })

      context('Search course target and click on three dot Training Reports option', () => {
        copManageCourse.searchCourseWithFilter()
        copManageCourse.clickOnCourseThreeDotOption(trainingReport, 'Training Reports')
      })

      context('expect to see training report overview', () => {
        trainingReportAssertion.expectToSeeTrainingReportTitle()
        trainingReportAssertion.expectToSeeSearchBox()
        trainingReportAssertion.expectToSeeExportButton()
        trainingReportAssertion.expectToSeeColumnHeaders(columnHeaderNames)
        advancedFilter.expectNotToSeeAdvanceFilter()
      })

      context('Add new table column', () => {
        trainingReport.clickOnManageColumnIcon()
        trainingReport.addNewTableColumn('Course End Date')
      })

      context('Expect to see new added column', () => {
        columnHeaderNames.push('Course End Date')
        trainingReportAssertion.expectToSeeColumnHeaders(columnHeaderNames)
      })
    })
  })
})
