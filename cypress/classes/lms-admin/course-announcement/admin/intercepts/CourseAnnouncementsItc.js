import InterceptReq from '../../../../base/InterceptReq'

class CourseAnnouncementsItc {
  static fetchAnnouncements = new InterceptReq(
    '/course_announcement/fetch_announcements',
    'FetchAnnouncements'
  )
  static modifyCourseAnnouncement = new InterceptReq(
    '/course_announcement/modify',
    'ModifyCourseAnnouncement'
  )
  static deleteAnnouncements = new InterceptReq(
    '/course_announcement/delete_announcements',
    'DeleteAnnouncements'
  )
  static publishCourseAnnouncement = new InterceptReq(
    '/course_announcement/publish',
    'PublishCourseAnnouncement'
  )
}
export default CourseAnnouncementsItc
