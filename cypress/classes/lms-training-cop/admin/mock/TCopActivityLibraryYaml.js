import EntryYamlManagement from '../../../utilities/EntryYamlManagement'

export default class TCopActivityLibraryYaml {
  #tCopActivityLibraryYaml = 'lms-training-cop/tcop-activity-library/tcop-activity-library'
  #tCopForActivityLibraryCop = 'NewActivityLibrary.tCopForActivityLibrary'
  #createNewActivity = 'NewActivityLibrary.tCopForActivityLibrary.activityLibrary.'
  #archiveCopCourseFuncActivityLibraryCourse = 'ArchiveActivityLibrary.copCourseFuncActivityLibrary'
  #editCopCourseFuncActivityLibraryCourse = 'EditActivityLibrary.copCourseFuncActivityLibrary'

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }

  #readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#tCopActivityLibraryYaml, entryPath, callback)
  }

  /*======================================== Course ==============================================*/
  getArchiveCopCourseFuncActivityLibraryCourse(callback) {
    this.#readYamlData(this.#archiveCopCourseFuncActivityLibraryCourse, callback)
  }
  getEditCopCourseFuncActivityLibraryCourse(callback) {
    this.#readYamlData(this.#editCopCourseFuncActivityLibraryCourse, callback)
  }

  /*======================================== Communities ==============================================*/
  getTCopForActivityLibraryCop(callback) {
    this.#readYamlData(this.#tCopForActivityLibraryCop, callback)
  }

  /*======================================== New Activities ===============================================*/
  #getCreateNewActivityByTitle(title, callback) {
    this.#readYamlData(this.#createNewActivity + title, callback)
  }
  getAuSCActivityElearningActivity(callback) {
    this.#getCreateNewActivityByTitle('auSCActivityElearning', callback)
  }
  getAuTCActivityFileImageActivity(callback) {
    this.#getCreateNewActivityByTitle('auTCActivityFileImage', callback)
  }
  getAuSCActivityRichTextActivity(callback) {
    this.#getCreateNewActivityByTitle('auSCActivityRichText', callback)
  }
  getAuSCActivityHyperlinkActivity(callback) {
    this.#getCreateNewActivityByTitle('auSCActivityHyperlinkCw', callback)
  }
  getAuSCActivityLearningGoal(callback) {
    this.#getCreateNewActivityByTitle('auSCActivityLearningGoal', callback)
  }
  getAuTCActivityQuiz(callback) {
    this.#getCreateNewActivityByTitle('auTCActivityQuiz', callback)
  }
  getAuSCActivityFileDocActivity(callback) {
    this.#getCreateNewActivityByTitle('auSCActivityFileDoc', callback)
  }
  getAuTCActivityFeedbackActivity(callback) {
    this.#getCreateNewActivityByTitle('auTCActivityFeedback', callback)
  }
  getAuTCActivityAssignmentActivity(callback) {
    this.#getCreateNewActivityByTitle('auTCActivityAssignment', callback)
  }
  getAuTCActivityVideoFileActivity(callback) {
    this.#getCreateNewActivityByTitle('auTCActivityVideoFile', callback)
  }
}
