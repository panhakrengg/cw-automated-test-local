import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const learningCop = new LearningCoP()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const ATTACHMENT_NAME = 'tennis alone.jpg'

  before(() => {
    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
    SignInAs.copMember(learningCop.getTrainingCopUrl())
  })

  context(Story.learner, () => {
    it('Learner able to download attachments in course detail before booking course', () => {
      Story.ticket('QA-768')
      learningCop.visitLearning()
      cy.waitLoadingOverlayNotExist()
      learningCop.sortCourseBy('Alphabetic Z-A')
      learningCop.clickOnCourseBy('Tennis By Yourself')
      learningCop.verifyDownloadCourseAttachment(ATTACHMENT_NAME)
    })
  })
})
