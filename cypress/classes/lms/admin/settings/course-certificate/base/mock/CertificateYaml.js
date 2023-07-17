import EntryYamlManagement from '../../../../../../utilities/EntryYamlManagement'

class CertificateYaml {
  #courseCertificatePath = 'lms-admin/course-certificate/course-certificate'
  #courseFuncEditDefaultCertificate = 'CourseData.courseFuncEditDefaultCertificate'
  #certificateDefaultContent = 'CertificateFireCloudZone.default'
  #courseFuncModifyLanguage = 'CourseData.courseFuncModifyLanguage'
  #courseFuncEnableCertificate = 'CourseData.courseFuncEnableCertificate'
  #courseFuncDisableCertificate = 'CourseData.courseFuncDisableCertificate'

  readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#courseCertificatePath, entryPath, callback)
  }
  getCourseFuncEditDefaultCertificate(callback) {
    this.readYamlData(this.#courseFuncEditDefaultCertificate, callback)
  }
  getCertificateDefaultContent(callback) {
    this.readYamlData(this.#certificateDefaultContent, callback)
  }
  getUserInfo(userEntryPath, callback) {
    cy.stubUser(userEntryPath)
    cy.get('@stubUser').then((user) => {
      callback(user)
    })
  }
  getCourseFuncModifyLanguage(callback) {
    this.readYamlData(this.#courseFuncModifyLanguage, callback)
  }
  getCourseFuncEnableCertificate(callback) {
    this.readYamlData(this.#courseFuncEnableCertificate, callback)
  }
  getCourseFuncDisableCertificate(callback) {
    this.readYamlData(this.#courseFuncDisableCertificate, callback)
  }
}
export default CertificateYaml
