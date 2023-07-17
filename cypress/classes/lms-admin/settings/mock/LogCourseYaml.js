import EntryYamlManagement from '../../../utilities/EntryYamlManagement'

export default class LogCourseYaml {
  #logCourseYaml = 'lms-admin/lms-change-log/log-course'
  #auCourseRequiredFieldLog = 'CreateCourse.auCourseRequiredFieldLog'
  #auCourseAllInfoLog = 'CreateCourse.auCourseAllInfoLog'
  #courseForPublishLog = 'PublishUnpublishCourse.courseForPublishLog'
  #auCourseDeleteLog = 'DeleteCourse.auCourseDeleteLog'
  #courseForEditInfoLog = 'EditCourse.courseForEditInfoLog'
  #courseForDisabledEnableDiscussionLog = 'EditCourse.courseForDisabledEnableDiscussionLog'
  #courseForDisabledEnableConnectLog = 'EditCourse.courseForDisabledEnableConnectLog'
  #newFileFolder = 'FacilitatorResources.newFileFolder'
  #deleteFileFolder = 'FacilitatorResources.deleteFileFolder'
  #auCourseNewCustomConsentLog = 'CourseConsents.auCourseNewCustomConsentLog'
  #courseEditConsentLog = 'CourseConsents.courseEditConsentLog'
  #courseSharingDeleteResourceLog = 'Courses.courseSharingDeleteResourceLog'
  #suggestThenApprove = 'ShareCourses.suggestThenApprove'
  #suggestThenDecline = 'ShareCourses.suggestThenDecline'
  #tCopFuncRequestToUseSharedCourse = 'ShareCourses.tCopFuncRequestToUseSharedCourse'
  #tCopRequestToUseCourse = 'ShareCourses.tCopFuncRequestToUseSharedCourse.sharedCourses'
  #requestWithoutPermission = `${this.#tCopRequestToUseCourse}.requestWithoutPermission`
  #requestThenDeny = `${this.#tCopRequestToUseCourse}.requestThenDeny`
  #requestThenApproveAllInstances = `${this.#tCopRequestToUseCourse}.requestThenApproveAllInstances`
  #requestThenApproveSpecificInstances = `${
    this.#tCopRequestToUseCourse
  }.requestThenApproveSpecificInstances`
  #defaultInstanceToSpecific = 'ShareCourses.defaultInstanceToSpecific'
  #defaultInstanceToAll = 'ShareCourses.defaultInstanceToAll'
  #allowDuplicateEnablePermission = 'ShareCourses.allowDuplicateEnablePermission'

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }

  #readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#logCourseYaml, entryPath, callback)
  }

  getAuCourseRequiredFieldLog(callback) {
    this.#readYamlData(this.#auCourseRequiredFieldLog, callback)
  }

  getAuCourseAllInfoLog(callback) {
    this.#readYamlData(this.#auCourseAllInfoLog, callback)
  }

  getCourseForPublishLog(callback) {
    this.#readYamlData(this.#courseForPublishLog, callback)
  }

  getAuCourseDeleteLog(callback) {
    this.#readYamlData(this.#auCourseDeleteLog, callback)
  }

  getCourseForEditInfoLog(callback) {
    this.#readYamlData(this.#courseForEditInfoLog, callback)
  }

  getCourseForDisabledEnableDiscussionLog(callback) {
    this.#readYamlData(this.#courseForDisabledEnableDiscussionLog, callback)
  }

  getCourseForDisabledEnableConnectLog(callback) {
    this.#readYamlData(this.#courseForDisabledEnableConnectLog, callback)
  }

  getCourseConsentNewResourceLog(callback) {
    this.#readYamlData(this.#newFileFolder, callback)
  }

  getDeleteFileFolder(callback) {
    this.#readYamlData(this.#deleteFileFolder, callback)
  }

  getAuCourseNewCustomConsentLog(callback) {
    this.#readYamlData(this.#auCourseNewCustomConsentLog, callback)
  }

  getCourseEditConsentLog(callback) {
    this.#readYamlData(this.#courseEditConsentLog, callback)
  }

  getCourseSharingDeleteResourceLog(callback) {
    this.#readYamlData(this.#courseSharingDeleteResourceLog, callback)
  }

  getSuggestThenApprove(callback) {
    this.#readYamlData(this.#suggestThenApprove, callback)
  }

  getSuggestThenDecline(callback) {
    this.#readYamlData(this.#suggestThenDecline, callback)
  }

  getTCopFuncRequestToUseSharedCourse(callback) {
    this.#readYamlData(this.#tCopFuncRequestToUseSharedCourse, callback)
  }

  getRequestWithoutPermission(callback) {
    this.#readYamlData(this.#requestWithoutPermission, callback)
  }

  getRequestThenDeny(callback) {
    this.#readYamlData(this.#requestThenDeny, callback)
  }

  getRequestThenApproveAllInstances(callback) {
    this.#readYamlData(this.#requestThenApproveAllInstances, callback)
  }

  getRequestThenApproveSpecificInstances(callback) {
    this.#readYamlData(this.#requestThenApproveSpecificInstances, callback)
  }

  getDefaultInstanceToSpecific(callback) {
    this.#readYamlData(this.#defaultInstanceToSpecific, callback)
  }

  getDefaultInstanceToAll(callback) {
    this.#readYamlData(this.#defaultInstanceToAll, callback)
  }

  getAllowDuplicateEnablePermission(callback) {
    this.#readYamlData(this.#allowDuplicateEnablePermission, callback)
  }
}
