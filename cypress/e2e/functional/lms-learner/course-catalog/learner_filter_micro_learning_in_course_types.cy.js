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
    it('Learner filter Micro-Learning in course types', () => {
      Story.ticket('QA-1805')

      context('Go to course catalog', () => {
        signInAsLms.couLead_Giles()
        learning.visitLearningPage()
        learning.switchToCourseCatalog()
      })

      context('Filter learning path', () => {
        learning.filterByLabelName(Lms.microLearning)
        learningCoP._expectToSeeOnlyMicroLearning()
      })

      context('Click the last pagination', () => {
        learning.clickTheLastPagination()
        learningCoP._expectToSeeOnlyMicroLearning()
      })
    })
  })
})
