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

  before(() => {
    trainingReportYamlStub.getCopInfoYaml((learnTennis) => {
      trainingReport = new TrainingReport(learnTennis.url[new Environment().getEnvYaml()])
    })
    SignInAs.copAdmin()
  })

  context(Story.trainingReport, () => {
    it('CoP Admin click on learner to view profile', () => {
      Story.ticket('QA-1155')

      context('visit training report section', () => {
        trainingReport.visit()
      })

      context('view learner detail screen', () => {
        trainingReport.clickOnFirstTableRow()
        trainingReportAssertion.expectToSeeLearnerDetailPopup()
      })

      context('view learner public profile and expect to see two tabs', () => {
        trainingReport.clickOnViewPublicProfile()
        trainingReportAssertion.expectToSeeEntryTabOnPublicProfile(
          ['Community'],
          ['Expertise & Qualifications']
        )
      })
    })
  })
})
