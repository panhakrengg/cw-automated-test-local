import EntryYamlManagement from '../../../utilities/EntryYamlManagement'

class CourseInstanceYamlStub {
  #archiveInstance = 'lms-admin/course-instance/archive-instance'
  #createInstance = 'lms-admin/course-instance/create-new-instances'
  #editInstance = 'lms-admin/course-instance/edit-instance'
  #courseFuncManageInstance = 'CourseData.courseFuncManageInstance'
  #courseFuncForNewInstance = 'CreateInstances.courseFuncForNewInstance'
  #editCourseFuncForNewInstance = 'EditInstance.courseFuncManageInstance'

  getCourseFuncManageInstanceForArchive(callback) {
    EntryYamlManagement._readDataEntry(
      this.#archiveInstance,
      this.#courseFuncManageInstance,
      callback
    )
  }

  getCourseFuncManageInstanceForEdit(callback) {
    EntryYamlManagement._readDataEntry(
      this.#editInstance,
      this.#editCourseFuncForNewInstance,
      callback
    )
  }

  getCourseFuncForNewInstance(callback) {
    EntryYamlManagement._readDataEntry(
      this.#createInstance,
      this.#courseFuncForNewInstance,
      callback
    )
  }

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }
}

export default CourseInstanceYamlStub
