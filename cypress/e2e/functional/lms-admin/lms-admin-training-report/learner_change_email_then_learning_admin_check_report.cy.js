import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Account from '../../../../classes/account/Account'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import { TrainingReportColumns } from '../../../../classes/lms/admin/training-report/constants/TrainingReportsConstants'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const account = new Account()
  const trainingReport = new TrainingReportsBase()
  const addColumn = [TrainingReportColumns.EMAIL_ORG_PROFILE]
  let learner, email, newEmail, screenName
  let instance

  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LEARNER_Change_Email_JEN).then((user) => {
      learner = user
      screenName = user.screenName
      email = user.email
      newEmail = user.secondEmail
    })
    trainingReport.yaml.getCourseInFullCatalog((data) => {
      instance = data.instanceSmokeLearnerChangeEmail
    })
  })

  after(() => {
    ReportDefect.markCwDefect('CW-18090: Email not change in Training Report')
  })

  context(Story.lmsAdminTrainingReports, () => {
    it.only('Learner change email then Learning admin check the user in report', () => {
      Story.ticket('QA-2154', ['CW-18090'])

      cy.logInTestCase('Learner change email')
      account.changeEmail(email, newEmail, screenName)

      cy.logInTestCase('Learning admin check in training report')
      trainingReport.login.toTopLevelAsLearningAdmin()

      trainingReport.actions.searchCoursesLearners(screenName)
      trainingReport.actions.addColumns(addColumn)
      trainingReport.assertions.expectTotalRecordAtLeast(1)
      trainingReport.assertions.verifyAfterUserChangeEmail(learner, instance)

      cy.logInTestCase('Reset: Learner change email to previous')
      account.changeEmail(newEmail, email, screenName)
    })
  })
})
