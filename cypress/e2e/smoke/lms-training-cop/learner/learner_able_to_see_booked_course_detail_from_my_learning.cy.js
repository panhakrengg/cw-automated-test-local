import Epic from '../../../../classes/Epic'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import CourseDetailOverview from '../../../../classes/lms/CourseDetailOverview'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  const lmsTrainingCop = new LmsTrainingCopBase()
  let courseData
  let courseInstanceId
  let bookedOptionalActivity

  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse.getTennisByYourself((data) => {
      courseData = data
      bookedOptionalActivity = courseData.courseInstances.bookedOptionalActivity
      faker.setPathFixture(bookedOptionalActivity)
      courseInstanceId = faker.getUrlId()
    })
  })

  context(Story.learner, () => {
    it('Learner able to see booked course detail from my learning', () => {
      Story.ticket('QA-582')
      SignInAs.copMember(courseDetail.urlCourseInstanceById(courseInstanceId))
      const courseDetailOverview = new CourseDetailOverview(
        courseData,
        courseData.courseInstances.bookedOptionalActivity
      )
      courseDetailOverview.verifyCourseOverview()
      courseDetail.expectedCourseLinks()
    })
  })
})
