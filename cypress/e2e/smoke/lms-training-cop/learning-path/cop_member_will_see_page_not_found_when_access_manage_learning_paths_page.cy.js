import Epic from '../../../../classes/Epic'
import CoPManageLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CopManageLearningPath'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const copManageLearningPath = new CoPManageLearningPath()
  before(() => {
    copManageLearningPath.stub.copInfo.setAdminLearnTennisUrl(copManageLearningPath)
  })
  context(Story.manageLearningPaths, () => {
    it('CoP Member will see page not found when access manage learning paths page', () => {
      Story.ticket('QA-1131', ['CW-16516'])

      SignInAs.copMember()
      cy.visit(copManageLearningPath.getManageLearningPathUrl(), { failOnStatusCode: false })
      cy.pageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
