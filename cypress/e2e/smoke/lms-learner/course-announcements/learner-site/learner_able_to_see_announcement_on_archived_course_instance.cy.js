import DeliveryMethod from '../../../../../classes/constants/course/DeliveryMethod'
import Epic from '../../../../../classes/Epic'
import CourseDetail from '../../../../../classes/lms/CourseDetail'
import CourseAnnouncement from '../../../../../classes/lms/learner/course-instance/CourseAnnouncement'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  const courseAnnouncement = new CourseAnnouncement()
  const signInLmsAs = new SignInLmsAs()

  context(Story.courseAnnouncementLearnerSite, () => {
    let course
    let virtualClassInstanceId
    let announcement

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.announcementForSomeInstanceStaticData
        faker.setPathFixture(course.virtualClassInstance)
        virtualClassInstanceId = faker.getUrlId()
      })
      new YamlHelper('lms/courses/sample-announcement').read().then(({ SampleAnnouncement }) => {
        announcement = SampleAnnouncement.someInstance
      })
    })

    it('Learner able to see course announcement on archived course instance', () => {
      Story.ticket('QA-1829')
      signInLmsAs.istMember_Delphia()
      courseDetail.visitCourseInstanceDetail(virtualClassInstanceId)
      courseAnnouncement._verifyCourseAnnouncementIsVisible(
        course,
        announcement.body.value,
        DeliveryMethod.VIRTUAL_CLASSROOM
      )
    })
  })
})
