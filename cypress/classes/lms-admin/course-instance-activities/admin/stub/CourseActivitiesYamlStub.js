import EntryYamlManagement from '../../../../utilities/EntryYamlManagement'

class CourseActivitiesYamlStub {
  #instanceActivities = 'lms-admin/org-course-instance-activities/instance-activities'
  #courseFuncActivityFromLibrary = 'CourseData.courseFuncActivityFromLibrary'
  #courseFuncActivityToLibrary = 'CourseData.courseFuncActivityToLibrary'
  #sPActivityElearningOrg = 'ActivityLibrary.elearning.sPActivityElearningOrg'
  #tPActivityQuizOrg = 'ActivityLibrary.quiz.tPActivityQuizOrg'
  #tOActivityImage = 'ActivityLibrary.file.tOActivityImage'
  #auSOActivityHyperlinkCw = 'ActivityLibrary.hyperlink.sOActivityLink'

  getCourseFuncActivityFromLibrary(callback) {
    EntryYamlManagement._readDataEntry(
      this.#instanceActivities,
      this.#courseFuncActivityFromLibrary,
      callback
    )
  }

  getSPActivityElearningOrg(callback) {
    EntryYamlManagement._readDataEntry(
      this.#instanceActivities,
      this.#sPActivityElearningOrg,
      callback
    )
  }

  getTPActivityQuizOrg(callback) {
    EntryYamlManagement._readDataEntry(this.#instanceActivities, this.#tPActivityQuizOrg, callback)
  }

  getTOActivityImage(callback) {
    EntryYamlManagement._readDataEntry(this.#instanceActivities, this.#tOActivityImage, callback)
  }

  getAuSOActivityHyperlinkCw(callback) {
    EntryYamlManagement._readDataEntry(
      this.#instanceActivities,
      this.#auSOActivityHyperlinkCw,
      callback
    )
  }

  getCourseFuncActivityToLibrary(callback) {
    EntryYamlManagement._readDataEntry(
      this.#instanceActivities,
      this.#courseFuncActivityToLibrary,
      callback
    )
  }

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }
}

export default CourseActivitiesYamlStub
