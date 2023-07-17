import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import Learning from '../../../../classes/lms/Learning'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const learningCop = new LearningCoP()

  before(() => {
    SignInAs.member_Arielle()
  })

  context(Story.courseCatalog, () => {
    it('Learner Sort by Alphabetic ', () => {
      Story.ticket('QA-1796')
      learning.visitLearningPage()
      learning.switchToCourseCatalog()

      context('Sort by A-Z', () => {
        learning.sortCourseBy('Alphabetic A-Z')
        learningCop.verifySortCourseByAscending()
      })

      context('Sort by Z-A', () => {
        learning.sortCourseBy('Alphabetic Z-A')
        learningCop.verifySortCourseByDescending()
      })
    })
  })
})
