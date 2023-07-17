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
    SignInAs.copMember(learningCop.getTrainingCopUrl())
  })

  context(Story.learner, () => {
    it('Learner click Go to My Learning in Learning', () => {
      Story.ticket('QA-596')

      learningCop.visitLearning()
      learningCop.expectGotoMyLearningButtonIsActive()
      learningCop.expectLearnerGoesToMyLearningPage()
    })
  })
})
