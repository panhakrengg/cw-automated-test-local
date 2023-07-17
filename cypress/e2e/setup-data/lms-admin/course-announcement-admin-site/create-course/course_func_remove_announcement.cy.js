import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/course-announcement-admin-site/course-announcements')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncRemoveAnnouncement
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseAnnouncementAdminSite, () => {
    it('Course Func for remove announcement', () => {
      setupCourse.setCourseObject(courseObj)

      setupCourse.createNewCourse()
    })
  })
})
