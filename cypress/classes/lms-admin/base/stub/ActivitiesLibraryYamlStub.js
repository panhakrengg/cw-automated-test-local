import EntryYamlManagement from '../../../utilities/EntryYamlManagement'

class ActivitiesLibraryYamlStub {
  #instanceActivities = 'lms-admin/org-activity-library/activity-library-info'
  #courseFuncActivityFromLibrary = 'CourseData.courseFuncActivityFromLibrary'
  #auTOActivityHyperlinkCw = 'ActivityLibrary.hyperlink.auTOActivityHyperlinkCw'
  #auSOActivityHyperlinkCw = 'ActivityLibrary.hyperlink.auSOActivityHyperlinkCw'
  #auSOActivityFilePdf = 'ActivityLibrary.file.auSOActivityFilePdf'
  #auSOActivityElearning = 'ActivityLibrary.elearning.auSOActivityElearning'
  #auSOActivityVideoFile = 'ActivityLibrary.video.auSOActivityVideoFile'
  #auSOActivityRichText = 'ActivityLibrary.richText.auSOActivityRichText'
  #auSOActivityLearningGoal = 'ActivityLibrary.learningGoal.auSOActivityLearningGoal'
  #tOActivityHyperlinkArchive = 'ActivityLibrary.hyperlink.tOActivityHyperlinkArchive'
  #auTOActivityQuiz = 'ActivityLibrary.quiz.auTOActivityQuiz'
  #auTOActivityAssignment = 'ActivityLibrary.assignment.auTOActivityAssignment'
  #auTOActivityFeedback = 'ActivityLibrary.feedback.auTOActivityFeedback'
  #sOActivityFileUnarchive = 'ActivityLibrary.file.sOActivityFileUnarchive'
  #sOActivityElearningEdit = 'ActivityLibrary.elearning.sOActivityElearningEdit'
  #sOActivityRichTextDelete = 'ActivityLibrary.richText.sOActivityRichTextDelete'
  #tOActivityAssignmentEdit = 'ActivityLibrary.assignment.tOActivityAssignmentEdit'
  #auSOActivityFileImage = 'ActivityLibrary.file.auSOActivityFileImage'

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }

  readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#instanceActivities, entryPath, callback)
  }

  getCourseFuncActivityFromLibrary(callback) {
    this.readYamlData(this.#courseFuncActivityFromLibrary, callback)
  }

  getAuTOActivityHyperlinkCw(callback) {
    this.readYamlData(this.#auTOActivityHyperlinkCw, callback)
  }

  getAuSOActivityHyperlinkCw(callback) {
    this.readYamlData(this.#auSOActivityHyperlinkCw, callback)
  }

  getAuSOActivityFilePdf(callback) {
    this.readYamlData(this.#auSOActivityFilePdf, callback)
  }

  getAuSOActivityElearning(callback) {
    this.readYamlData(this.#auSOActivityElearning, callback)
  }

  getAuSOActivityVideoFile(callback) {
    this.readYamlData(this.#auSOActivityVideoFile, callback)
  }

  getAuSOActivityRichText(callback) {
    this.readYamlData(this.#auSOActivityRichText, callback)
  }

  getAuSOActivityLearningGoal(callback) {
    this.readYamlData(this.#auSOActivityLearningGoal, callback)
  }

  getTOActivityHyperlinkArchive(callback) {
    this.readYamlData(this.#tOActivityHyperlinkArchive, callback)
  }

  getAuTOActivityQuiz(callback) {
    this.readYamlData(this.#auTOActivityQuiz, callback)
  }

  getAuTOActivityAssignment(callback) {
    this.readYamlData(this.#auTOActivityAssignment, callback)
  }

  getAuTOActivityFeedback(callback) {
    this.readYamlData(this.#auTOActivityFeedback, callback)
  }

  getSOActivityFileUnarchive(callback) {
    this.readYamlData(this.#sOActivityFileUnarchive, callback)
  }

  getSOActivityElearningEdit(callback) {
    this.readYamlData(this.#sOActivityElearningEdit, callback)
  }

  getSOActivityRichTextDelete(callback) {
    this.readYamlData(this.#sOActivityRichTextDelete, callback)
  }

  getTOActivityAssignmentEdit(callback) {
    this.readYamlData(this.#tOActivityAssignmentEdit, callback)
  }

  getAuSOActivityFileImage(callback) {
    this.readYamlData(this.#auSOActivityFileImage, callback)
  }
}

export default ActivitiesLibraryYamlStub
