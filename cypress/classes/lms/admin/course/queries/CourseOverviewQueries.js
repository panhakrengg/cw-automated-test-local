import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'

export default class CourseOverviewQueries {
  getUrlOrgLms(courseId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=course-overview`
  }

  getUrlCop(copUrl, courseId) {
    return `${copUrl}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_copMemberManagementPortlet_id=${courseId}&_copMemberManagementPortlet_tab=course-overview`
  }
}
