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

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.announcementExpiration
        faker.setPathFixture(course.virtualClassInstance)
        virtualClassInstanceId = faker.getUrlId()
      })
    })

    it('Learner not able to see expired course announcement', () => {
      Story.ticket('QA-1826')
      signInLmsAs.istMember_Delphia()
      courseDetail.visitCourseInstanceDetail(virtualClassInstanceId)
      courseAnnouncement._verifyCourseAnnouncementNotExist()
    })
  })
})
