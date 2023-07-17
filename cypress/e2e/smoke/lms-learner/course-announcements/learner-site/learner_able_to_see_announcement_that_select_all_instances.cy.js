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
    let selfStudyInstanceId
    let physicalClassInstanceId
    let course
    let announcement

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.announcementForAllInstanceStaticData
        faker.setPathFixture(course.selfStudyInstance)
        selfStudyInstanceId = faker.getUrlId()
        faker.setPathFixture(course.physicalClassInstance)
        physicalClassInstanceId = faker.getUrlId()
      })
      new YamlHelper('lms/courses/sample-announcement').read().then(({ SampleAnnouncement }) => {
        announcement = SampleAnnouncement.forAllInstance
      })
    })

    it('Learner able to see course announcement that select all instances', () => {
      Story.ticket('QA-1824')
      signInLmsAs.istMember_Delphia()
      courseDetail.visitCourseInstanceDetail(selfStudyInstanceId)
      courseAnnouncement._verifyCourseAnnouncementIsVisible(
        course,
        announcement.body.value,
        DeliveryMethod.SELF_STUDY
      )
      courseDetail.visitCourseInstanceDetail(physicalClassInstanceId)
      courseAnnouncement._verifyCourseAnnouncementIsVisible(
        course,
        announcement.body.value,
        DeliveryMethod.PHYSICAL_CLASSROOM
      )
    })
  })
})
