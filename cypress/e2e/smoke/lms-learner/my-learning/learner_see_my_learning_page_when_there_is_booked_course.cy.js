import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import CourseDetailOverview from '../../../../classes/lms/CourseDetailOverview'
import MyLearning from '../../../../classes/lms/learner/my-learning/MyLearning'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const myLearning = new MyLearning()
  const courseDetail = new CourseDetail()
  const signInLmsAs = new SignInLmsAs()
  let courseDetailOverview

  context(Story.myLearningFilter, () => {
    let course
    let status

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ Status, CourseData }) => {
        status = Object.values(Status)
        course = CourseData.connectEveryoneInCourse
        courseDetailOverview = new CourseDetailOverview(course, course.physicalClass)
      })
    })

    it('Learner able to see My Learning page when there is booked course', () => {
      Story.ticket('QA-1800')
      signInLmsAs.couMember_Litzy()
      learning.visitLearningPage()
      learning.expectToNotSeePopularCourses()
      learning._verifyBannerIsVisible()
      myLearning._verifyStatusDropdown(status)
      learning._verifyNavSearch()
      myLearning._verifyHeaderAndTotalCourses()
      myLearning._verifyCourseCardInMyLearning(course)
      learning.clickCourseTitle(course.name)
      courseDetail.expectedCourseLinks()
      courseDetail._verifyMainHeaderIsVisible(course.name)
      courseDetailOverview._verifyCourseProgressAndActivities()
    })
  })
})
