import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupAnnouncement from '../../../../../classes/lms/admin/setup-data/SetupAnnouncement'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupAnnouncement = new SetupAnnouncement()

  before(() => {
    setupAnnouncement.setCourseAnnouncementAdminYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseAnnouncementAdminSite, () => {
    it('Setup announcement for "Course Func for unpublish announcement"', () => {
      setupAnnouncement.setCourseBaseYaml('courseFuncUnpublishAnnouncement')
      setupAnnouncement.setAnnouncementBaseYaml('forUnpublish')

      setupAnnouncement.createAnnouncementFromCourseList()
    })
  })
})
