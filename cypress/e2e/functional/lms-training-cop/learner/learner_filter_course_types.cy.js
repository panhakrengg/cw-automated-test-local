import { Lms } from '../../../../classes/constants/Lms'
import Epic from '../../../../classes/Epic'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const learningCoP = new LearningCoP(CoPConst.URL)

  context(Story.learner, () => {
    it('Learner filter course types', () => {
      Story.ticket('QA-1171')

      SignInAs.copMember()
      context('Redirect to my learning', () => {
        learningCoP.visitLearning()
        cy.waitLoadingOverlayNotExist()
      })

      context('Filter only learning path', () => {
        learningCoP._filterByLabelName(Lms.learningPath)
        learningCoP._expectToSeeOnlyLearningPath()
      })
    })
  })
})
