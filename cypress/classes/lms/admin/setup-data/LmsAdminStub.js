import YamlHelper from '../../../utilities/YamlHelper'

class LmsAdminStub {
  yamlStub
  activityLibraryObj
  certificateObj

  courseName
  elearningObj
  hyperlinkObj
  fileObj
  richTextObj

  setOrgInstanceActivityYaml() {
    new YamlHelper('lms-admin/org-course-instance-activities/instance-activities')
      .read()
      .then((OrgActivityLibraryYaml) => {
        this.yamlStub = OrgActivityLibraryYaml
      })
  }
  setOrgActivityLibraryYaml() {
    new YamlHelper('lms-admin/org-activity-library/activity-library-info')
      .read()
      .then((OrgActivityLibraryYaml) => {
        this.yamlStub = OrgActivityLibraryYaml
      })
  }
  setCourseCertificateYaml() {
    new YamlHelper('lms-admin/course-certificate/course-certificate')
      .read()
      .then((CourseCertificateYaml) => {
        this.yamlStub = CourseCertificateYaml
      })
  }
  setCourseDiscussionAdminYaml() {
    new YamlHelper('lms-admin/discussion-admin-site/course-discussion-info')
      .read()
      .then((CourseCertificateYaml) => {
        this.yamlStub = CourseCertificateYaml
      })
  }
  setCourseAnnouncementAdminYaml() {
    new YamlHelper('lms-admin/course-announcement-admin-site/course-announcements')
      .read()
      .then((AnnouncementYaml) => {
        this.yamlStub = AnnouncementYaml
      })
  }

  setWithdrawCoursesYaml() {
    new YamlHelper('lms-learner/course-progress-and-certificate/withdraw-courses')
      .read()
      .then((AnnouncementYaml) => {
        this.yamlStub = AnnouncementYaml
      })
  }

  setRetakeCoursesYaml() {
    new YamlHelper('lms-learner/course-progress-and-certificate/retake-course')
      .read()
      .then((AnnouncementYaml) => {
        this.yamlStub = AnnouncementYaml
      })
  }

  setMixActivitiesYaml() {
    new YamlHelper('lms-learner/course-progress-and-certificate/progress_on_mix_activities')
      .read()
      .then((AnnouncementYaml) => {
        this.yamlStub = AnnouncementYaml
      })
  }

  setEnableCertificateYaml() {
    new YamlHelper('lms-learner/course-progress-and-certificate/enable-certificate')
      .read()
      .then((EnableCertificateYaml) => {
        this.yamlStub = EnableCertificateYaml
      })
  }

  setDisableCertificateYaml() {
    new YamlHelper('lms-learner/course-progress-and-certificate/disable-certificate')
      .read()
      .then((DisableCertificateYaml) => {
        this.yamlStub = DisableCertificateYaml
      })
  }

  setCourseBaseYaml(course) {
    this.courseObj = this.yamlStub.CourseData[course]
    this.courseName = this.courseObj.name.value
    if (this.courseObj.trainingCoP) {
      this.isCoP = true
      this.trainingCoPObj = this.courseObj.trainingCoP
    }
  }

  setCourseObj(courseObj) {
    this.courseObj = courseObj
    this.courseName = this.courseObj.name
    if (this.courseObj.trainingCoP) {
      this.isCoP = true
      this.trainingCoPObj = this.courseObj.trainingCoP
    }
  }

  setInstanceBaseYaml(instance) {
    this.instanceObj = this.courseObj[instance]

    const { title } = this.instanceObj
    this.instanceName = title.value ? title.value : title
  }

  setDuplicateInstanceBaseYaml(instance) {
    this.dupInstanceObj = this.courseObj[instance]
    this.dupInstanceName = this.dupInstanceObj.title.value
  }

  setActivityBaseYaml() {
    this.activityLibraryObj = this.yamlStub.ActivityLibrary
  }

  setCertificateFireCloudBaseYaml(type) {
    this.certificateObj = this.yamlStub.CertificateFireCloudZone[type]
  }

  setCourseName(name) {
    this.courseName = name
  }

  setInstanceObject(object) {
    this.instanceObj = object

    const { title } = object
    this.instanceName = title.value ? title.value : title
  }

  setElearningObject(elearning) {
    this.setActivityBaseYaml()
    this.elearningObj = this.activityLibraryObj.elearning[elearning]
  }

  setHyperlinkObject(hyperlink) {
    this.setActivityBaseYaml()
    this.hyperlinkObj = this.activityLibraryObj.hyperlink[hyperlink]
  }

  setFileObject(file) {
    this.setActivityBaseYaml()
    this.fileObj = this.activityLibraryObj.file[file]
  }

  setRichTextObject(richText) {
    this.setActivityBaseYaml()
    this.richTextObj = this.activityLibraryObj.richText[richText]
  }

  setAnnouncementBaseYaml(announcement) {
    this.announcementObj = this.courseObj.announcements[announcement]
  }
}
export default LmsAdminStub
