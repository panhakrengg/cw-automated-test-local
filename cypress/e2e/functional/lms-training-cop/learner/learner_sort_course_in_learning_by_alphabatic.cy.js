import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const learningCop = new LearningCoP()
  const lmsTCoPMock = new LmsTrainingCopMock()

  before(() => {
    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
    SignInAs.copMember()
  })

  context(Story.learner, () => {
    it('Learner sort course in Learning by Alphabetic', () => {
      Story.ticket('QA-767')
      context('Redirect to cop learning', () => {
        learningCop.visitLearning()
        cy.waitLoadingOverlayNotExist()
      })

      context('Sort by A-Z', () => {
        learningCop.sortCourseBy('Alphabetic A-Z')
        learningCop.verifySortCourseByAscending()
      })

      context('Sort by Z-A', () => {
        learningCop.sortCourseBy('Alphabetic Z-A')
        learningCop.verifySortCourseByDescending()
      })
    })
  })
})
