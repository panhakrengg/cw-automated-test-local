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
    it('Learner filter Course in course types', () => {
      Story.ticket('QA-1804')

      context('Go to course catalog', () => {
        signInAsLms.couLead_Giles()
        learning.visitLearningPage()
        learning.switchToCourseCatalog()
      })

      context('Filter courses', () => {
        learning.clickFilterItem(Lms.courseTypes, Lms.course)
        learningCoP._expectToSeeOnlyCourse()
      })

      context('Click the last pagination', () => {
        learning.clickTheLastPagination()
        learningCoP._expectToSeeOnlyCourse()
      })
    })
  })
})
