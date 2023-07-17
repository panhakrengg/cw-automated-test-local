import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const signInLmsAs = new SignInLmsAs()
  const learning = new Learning()

  before(() => {
    signInLmsAs.lnAdmin_Emery()
  })

  context(Story.courseCatalog, () => {
    it('Learner filter by Providers', () => {
      Story.ticket('QA-1799')
      learning.visitLearningPage()
      learning.switchToCourseCatalog()

      learning.expectOnlyProviderCoursesByApplyProviderFilter('Khalibre')
      learning.expectOnlyProviderCoursesInTheLastPaginationPage('Khalibre')
    })
  })
})
