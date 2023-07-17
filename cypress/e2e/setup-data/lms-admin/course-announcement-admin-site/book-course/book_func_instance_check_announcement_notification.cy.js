import SetUpBooking from '../../../../../classes/course/SetUpBooking'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupBooking = new SetUpBooking()

  before(() => {
    new YamlHelper('lms-admin/course-announcement-admin-site/course-announcements')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncForCreateAnnouncement
        instanceObj = courseObj.funcInstanceCheckAnnouncementNotify
      })
    new SignInLmsAs().couMember_Litzy()
  })

  context(Story.courseAnnouncementAdminSite, () => {
    it('Book course "Func Instance to check announcement notification"', () => {
      setupBooking.setCourseObject(courseObj)
      setupBooking.setInstanceObject(instanceObj)
      setupBooking.bookCourseBySearchFromGlobal()
    })
  })
})
