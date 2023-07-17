import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import ActivityUI from '../../../../classes/lms/base-manage-course/ActivityUI'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, { tags: ['@skipFeatureChange'] }, () => {
  let courseInstanceId = 0
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  const lmsTrainingCop = new LmsTrainingCopBase()
  let courseActivity

  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse.getTennisByYourself((course) => {
      let courseInstanceInfo = {}
      courseInstanceInfo = course.courseInstances.bookedOptionalActivity
      faker.setPathFixture(courseInstanceInfo)
      courseInstanceId = faker.getUrlId()
      courseActivity = new ActivityUI(courseInstanceInfo)
    })
  })

  context(Story.learner, () => {
    it('Learner able to see optional activities on booked course', () => {
      Story.ticket('QA-1487')
      const facilitatorUser = lmsTrainingCop.getFacilitatorUser()
      SignInAs.copMember()
      courseDetail.visitCourseInstanceDetail(courseInstanceId)
      courseActivity._expectAllOptionalActivitiesUI(facilitatorUser)
    })
  })
})
