import Epic from '../../../../classes/Epic'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const learningCoP = new LearningCoP(CoPConst.URL)

  context(Story.learner, () => {
    it('Learner filter categories', () => {
      Story.ticket('QA-1174')

      SignInAs.copMember()
      context('Redirect to my learning', () => {
        learningCoP.visitLearning()
        cy.waitLoadingOverlayNotExist()
      })

      context('Filter categories', () => {
        learningCoP._filterByLabelName('Online Communities')
        learningCoP.sortCourseBy('Most Popular')
        learningCoP._expectToSeeCourseBaseOnCategories()
      })
    })
  })
})
