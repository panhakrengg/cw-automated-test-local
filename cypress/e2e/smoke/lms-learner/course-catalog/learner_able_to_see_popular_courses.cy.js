import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import MyLearningAssertion from '../../../../classes/lms/learning/MyLearningAssertion'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const learnerAssertion = new MyLearningAssertion()

  before(() => {
    SignInAs.member_Arielle()
  })

  context(Story.courseCatalog, () => {
    it('Learner able to see Popular courses', () => {
      Story.ticket('QA-1821')
      learning.visitLearningPage()
      learning.expectEmptyResultWhenSearchCourse('Expect_to_see_Popular_Courses')
      learnerAssertion.expectToSeePopularCourses()
    })
  })
})
