import EntryYamlManagement from '../../../../utilities/EntryYamlManagement'

class CourseAnnouncementsYaml {
  #courseAnnouncementsPath = 'lms-admin/course-announcement-admin-site/course-announcements'
  #courseFuncForCreateAnnouncement = 'NewAnnouncements.courseFuncForCreateAnnouncement'
  #courseFuncNewInstanceUnderAnnouncement = 'CreateInstances.courseFuncNewInstanceUnderAnnouncement'
  #courseFuncRemoveAnnouncement = 'DeleteAnnouncements.courseFuncRemoveAnnouncement'
  #courseFuncPublishAnnouncement = 'CourseData.courseFuncPublishAnnouncement'
  #courseFuncUnpublishAnnouncement = 'CourseData.courseFuncUnpublishAnnouncement'

  readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#courseAnnouncementsPath, entryPath, callback)
  }

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }

  getCourseFuncForCreateAnnouncement(callback) {
    this.readYamlData(this.#courseFuncForCreateAnnouncement, callback)
  }

  getCourseFuncNewInstanceUnderAnnouncement(callback) {
    this.readYamlData(this.#courseFuncNewInstanceUnderAnnouncement, callback)
  }

  getCourseFuncRemoveAnnouncement(callback) {
    this.readYamlData(this.#courseFuncRemoveAnnouncement, callback)
  }

  getCourseFuncPublishAnnouncement(callback) {
    this.readYamlData(this.#courseFuncPublishAnnouncement, callback)
  }

  getCourseFuncUnpublishAnnouncement(callback) {
    this.readYamlData(this.#courseFuncUnpublishAnnouncement, callback)
  }
}
export default CourseAnnouncementsYaml
