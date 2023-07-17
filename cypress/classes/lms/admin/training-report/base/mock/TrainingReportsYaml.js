import EntryYamlManagement from '../../../../../utilities/EntryYamlManagement'

class TrainingReportsYaml {
  #courseCertificatePath = 'lms-admin/lms-admin-training-reports/training-reports'
  #checkFilterValidation = 'AdvancedFilters.checkFilterValidation'
  #learningAdminManageColumns = 'ManageColumns.learningAdmin'
  #searchInReport = 'SearchInReport'
  #showLearnersWhoNotBookCourseHaveAdminLearnerBooked =
    'ShowLearnersWhoNotBookCourse.courseHaveAdminLearnerBooked'
  #courseFuncForReport = 'Courses.courseFuncForReport'
  #courseInFullCatalog = 'Courses.courseFullCatalog'

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }
  #readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#courseCertificatePath, entryPath, callback)
  }
  getClearFilterValidation(callback) {
    this.#readYamlData(this.#checkFilterValidation, callback)
  }
  getLearningAdminManageColumns(callback) {
    this.#readYamlData(this.#learningAdminManageColumns, callback)
  }
  getSearchInReport(callback) {
    this.#readYamlData(this.#searchInReport, callback)
  }
  getShowLearnersWhoNotBookCourseHaveAdminLearnerBooked(callback) {
    this.#readYamlData(this.#showLearnersWhoNotBookCourseHaveAdminLearnerBooked, callback)
  }
  getCourseFuncForReport(callback) {
    this.#readYamlData(this.#courseFuncForReport, callback)
  }
  getCourseInFullCatalog(callback) {
    this.#readYamlData(this.#courseInFullCatalog, callback)
  }
}

export default TrainingReportsYaml
