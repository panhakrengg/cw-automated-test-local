import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import CourseCatalogAssertion from '../../../../classes/lms/learning/CourseCatalogAssertion'
import MyLearningAction from '../../../../classes/lms/learning/MyLearningAction'
import MyLearningAssertion from '../../../../classes/lms/learning/MyLearningAssertion'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const myLearningAssertion = new MyLearningAssertion()
  const myLearningAction = new MyLearningAction()
  const courseCatalogAssertion = new CourseCatalogAssertion()

  before(() => {
    SignInAs.member_Arielle()
  })

  context(Story.courseCatalog, () => {
    it('Learner able to see My Learning and Catalog filter when not enrolled in any learnings', () => {
      Story.ticket('QA-1801')
      learning.visitLearningPage()
      myLearningAssertion.expectToSeePopularCourses()
      myLearningAssertion.expectMyLearningCount(0)
      myLearningAssertion.expectEmptyStateNotEnroll()
      myLearningAction.clickBrowserCourseCatalog()
      courseCatalogAssertion.expectCourseCatalogCount()
      courseCatalogAssertion.toggleSelectedCourseCatalog()
    })
  })
})
