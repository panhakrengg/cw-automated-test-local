import Epic from '../../../../classes/Epic'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import ActivityUI from '../../../../classes/lms/base-manage-course/ActivityUI'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId = 0
  let courseInstanceId = 0
  let courseInstanceInfo = {}
  let courseActivity
  const faker = new Faker()
  const learningCop = new LearningCoP()
  const courseDetail = new CourseDetail()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const lmsTrainingCop = new LmsTrainingCopBase()

  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse.getTennisByYourself((course) => {
      courseInstanceInfo = course.courseInstances.bookedNotOptional
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      faker.setPathFixture(courseInstanceInfo)
      courseInstanceId = faker.getUrlId()
      courseActivity = new ActivityUI(courseInstanceInfo)
    })
    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
    SignInAs.copMember(learningCop.getTrainingCopUrl())
  })

  const expectBookedCourse = () => {
    courseDetail.initInstanceCardByDate(courseInstanceInfo.date)
    courseDetail.expectBookButtonIsDisabled()
    // courseActivity._expectActivitiesTitle() TODO: need CW-15690 fix
    courseDetail.clickStart()
    courseDetail.expectedCourseLinks()
    courseActivity._expectActivitiesTitle()
  }

  context(Story.learner, () => {
    it('Learner able to see booked course from CoP Learning and Course Catalog', () => {
      Story.ticket('QA-947', ['CW-15690'])
      cy.logInTestCase('CoP Learning')
      learningCop.visitCourseDetailInCopLearning(courseId)
      expectBookedCourse()

      cy.logInTestCase('Course Catalog')
      courseDetail.visitCourseDetail(courseId)
      expectBookedCourse()
    })
  })
})
