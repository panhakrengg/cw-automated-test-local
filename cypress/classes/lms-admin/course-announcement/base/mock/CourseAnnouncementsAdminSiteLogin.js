import EntryYamlManagement from '../../../../utilities/EntryYamlManagement'
import SignInAs from '../../../../utilities/SignInAs'
import CourseAnnouncementsItc from '../../admin/intercepts/CourseAnnouncementsItc'
import CourseAnnouncementsQueries from '../../admin/queries/CourseAnnouncementsQueries'

class CourseAnnouncementsAdminSiteLogin {
  #queries = new CourseAnnouncementsQueries()

  #getUrl(obj) {
    const courseId = EntryYamlManagement._getUrlId(obj)
    return this.#queries.getCourseAnnouncementsUrl(courseId)
  }

  toCourseAnnouncementsAsCourseAdminTressie(obj) {
    CourseAnnouncementsItc.fetchAnnouncements.set()
    SignInAs.courseAdminTressie(this.#getUrl(obj))
    CourseAnnouncementsItc.fetchAnnouncements.wait()
  }

  toCourseAnnouncementsAsCategoryAdminKenton(obj) {
    CourseAnnouncementsItc.fetchAnnouncements.set()
    SignInAs.categoryAdminKenton(this.#getUrl(obj))
    CourseAnnouncementsItc.fetchAnnouncements.wait()
  }

  toCourseAnnouncementsAsLearningAdminEmery(obj) {
    CourseAnnouncementsItc.fetchAnnouncements.set()
    SignInAs.learningAdminEmery(this.#getUrl(obj))
    CourseAnnouncementsItc.fetchAnnouncements.wait()
  }

  toCourseAnnouncementsAsOrgAdminAmy(obj) {
    CourseAnnouncementsItc.fetchAnnouncements.set()
    SignInAs.orgAdmin_Amy(this.#getUrl(obj))
    CourseAnnouncementsItc.fetchAnnouncements.wait()
  }
}

export default CourseAnnouncementsAdminSiteLogin
