class BaseCourseInstance {
  courseId
  instanceId
  orgFullCatalogId

  setCourseAndInstanceId(courseId, instanceId) {
    this.courseId = courseId
    this.instanceId = instanceId
    console.log(this.courseId, this.instanceId)
  }
  getOrgCatalogCourseInstanceUrl(fullCatalogUrl, tab = 'overview') {
    return `${fullCatalogUrl}/manage-courses?_learningAdminManageCoursesPortlet_id=${this.instanceId}&_learningAdminManageCoursesPortlet_courseId=${this.courseId}&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0#_learningAdminManageCoursesPortlet_tab=${tab}`
  }
  getMemberCourseDetailUrl(tab = 'overview') {
    return `/web/ci${this.instanceId}/course-detail#_courseDetailPortlet_tab=${tab}`
  }
  getOrgCatalogCourseUrl(fullCatalogUrl, tab = 'overview') {
    return `${fullCatalogUrl}/manage-courses?_learningAdminManageCoursesPortlet_id=${this.courseId}&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0#_learningAdminManageCoursesPortlet_tab=${tab}`
  }
}
export default BaseCourseInstance
