import CourseAnnouncementsActions from '../admin/actions/CourseAnnouncementsActions'
import CourseAnnouncementsAssertions from '../admin/assertions/CourseAnnouncementsAssertions'
import CourseAnnouncementAdminSiteLogin from './mock/CourseAnnouncementsAdminSiteLogin'

class AdminCourseAnnouncement {
  constructor() {
    this.login = new CourseAnnouncementAdminSiteLogin()
    this.action = new CourseAnnouncementsActions()
    this.assertion = new CourseAnnouncementsAssertions()
  }
}

export default AdminCourseAnnouncement
