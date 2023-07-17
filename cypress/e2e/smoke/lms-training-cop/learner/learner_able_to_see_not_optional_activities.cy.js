import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import ActivityUI from '../../../../classes/lms/base-manage-course/ActivityUI'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsTrainingCop, { tags: ['@skipFeatureChange'] }, () => {
  let courseInstanceId = 0
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  let courseActivity
  let facilitatorUser
  const lmsTrainingCop = new LmsTrainingCopBase()
  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse.getTennisByYourself((course) => {
      const courseInstanceInfo = course.courseInstances.bookedNotOptional
      faker.setPathFixture(courseInstanceInfo)
      courseInstanceId = faker.getUrlId()
      courseActivity = new ActivityUI(courseInstanceInfo)
    })
    cy.stubUser(UserRole.CoPUsers.OWNER)
    cy.get('@stubUser').then((user) => {
      facilitatorUser = new Environment().isPrd() ? user.fullName : user.screenName
    })
  })

  context(Story.learner, () => {
    it('Learner able to see not optional activities on booked course', () => {
      Story.ticket('QA-1717')
      SignInAs.copMember()
      courseDetail.visitCourseInstanceDetail(courseInstanceId)
      courseActivity._expectAllNotOptionalActivitiesUI(facilitatorUser)
    })
  })
})
