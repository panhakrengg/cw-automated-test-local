import Epic from '../../../../../classes/Epic'
import CourseCatalog from '../../../../../classes/lms/CourseCatalog'
import CourseAnnouncement from '../../../../../classes/lms/learner/course-instance/CourseAnnouncement'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const courseCatalog = new CourseCatalog()
  const faker = new Faker()
  const courseAnnouncement = new CourseAnnouncement()
  const signInLmsAs = new SignInLmsAs()

  context(Story.courseAnnouncementLearnerSite, () => {
    let courseId

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        const course = CourseData.announcementForAllInstanceStaticData
        faker.setPathFixture(course)
        courseId = faker.getUrlId()
      })
    })

    it('Category Member not able to see course announcement that not booked yet', () => {
      Story.ticket('QA-1825')
      signInLmsAs.ctgMember_Quentin()
      courseCatalog.visitCourseDetail(courseId)
      courseAnnouncement._verifyCourseAnnouncementNotExist()
    })
  })
})
