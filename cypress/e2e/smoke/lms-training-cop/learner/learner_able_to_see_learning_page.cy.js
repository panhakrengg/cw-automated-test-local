import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const learningCop = new LearningCoP()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const menuData = {
    sortBy: {
      mostRecent: 'Most Recent',
      mostPopular: 'Most Popular',
      alphaAZ: 'Alphabetic A-Z',
      alphaZA: 'Alphabetic Z-A',
    },
  }

  before(() => {
    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
    SignInAs.copMember(learningCop.getTrainingCopUrl())
  })

  context(Story.learner, () => {
    it('Learner able to see Learning page', () => {
      Story.ticket('QA-1170')

      learningCop.visitLearning()
      learningCop.expectHeaderElementsAreVisible(menuData.sortBy)
      learningCop.expectLearningBannerIsVisible()
      learningCop.expectCoursesAttributesAreListed()
      learningCop.expectCourseFiltersAreListed()
    })
  })
})
