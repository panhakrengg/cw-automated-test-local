import { Lms } from '../../../../classes/constants/Lms'
import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const signInAsLms = new SignInLmsAs()
  const learning = new Learning()
  const learningCoP = new LearningCoP()

  context(Story.courseCatalog, () => {
    it('Learner filter Learning Path in course types', () => {
      Story.ticket('QA-1758')

      context('Go to course catalog', () => {
        signInAsLms.couMember_Litzy()
        learning.visitLearningPage()
        learning.switchToCourseCatalog()
      })

      context('Filter and Only learning path display', () => {
        learning.filterByLabelName(Lms.learningPath)
        learningCoP._expectToSeeOnlyLearningPath()
      })

      context('Click the last pagination and Only learning path display', () => {
        learning.clickTheLastPagination()
        learningCoP._expectToSeeOnlyLearningPath()
      })
    })
  })
})
