import { OrgConst } from '../../../../../org-management/base-org-management/OrgStub'

export default class InstancePeopleQueries {
  getUrlOrgLms(courseId, instanceId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${instanceId}&_learningAdminManageCoursesPortlet_tab=overview&_learningAdminManageCoursesPortlet_courseId=${courseId}#_learningAdminManageCoursesPortlet_tab=people`
  }

  getUrlCop(copAdminUrl, courseId, instanceId) {
    return `${copAdminUrl}?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_copMemberManagementPortlet_id=${instanceId}&_copMemberManagementPortlet_tab=people&_copMemberManagementPortlet_courseId=${courseId}`
  }

  getLearnerTable() {
    return cy.getTableWrapper(1)
  }

  getLearnerRow(email) {
    return cy.getTableWrapper(1).within(() => cy.rowName(email))
  }

  getButtonAddLearner() {
    return cy.getButtonByName('Add Learners')
  }

  getInputSearchUserByName() {
    return cy.getInputByPlaceholder('Search users by name')
  }
}
