import Field from '../../../constants/Field'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'
import { ResourceConstant } from '../constant/ResourceConstant'

export default class ResourceQueries {
  getUrlAdminOrgLms(courseId, instanceId) {
    const orgLmsFullCatalog = `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2F`
    const learnerResourcesUrl = `${orgLmsFullCatalog}course_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${instanceId}&_learningAdminManageCoursesPortlet_tab=resources&_learningAdminManageCoursesPortlet_courseId=${courseId}`
    const facilitatorResourcesUrl = `${orgLmsFullCatalog}course%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=admin-resources`

    return instanceId ? learnerResourcesUrl : facilitatorResourcesUrl
  }

  getUrlAdminCop(copUrl, courseId, instanceId) {
    const copCourseAdmin = `${copUrl}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2F`
    const learnerResourcesUrl = `${copCourseAdmin}course_instance%2Fedit&_copMemberManagementPortlet_id=${instanceId}&_copMemberManagementPortlet_tab=resources&_copMemberManagementPortlet_courseId=${courseId}`
    const facilitatorResourcesUrl = `${copCourseAdmin}course%2Fedit&_copMemberManagementPortlet_id=${courseId}&_copMemberManagementPortlet_tab=admin-resources`

    return instanceId ? learnerResourcesUrl : facilitatorResourcesUrl
  }

  getUrlLearner(instanceId) {
    return `/web/ci${instanceId}/course-detail?p_p_id=courseDetailPortlet&p_p_lifecycle=0&_courseDetailPortlet_isMyLearning=true&_courseDetailPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail#_courseDetailPortlet_tab=resources`
  }

  getButtonDelete() {
    return cy.getButtonByName(Field.DELETE)
  }

  findFileFolder() {
    cy.cecTable().within(($table) => {
      cy.wrap($table.find('td.d-md-table-cell').length > 0).as('foundFileFolder')
    })
    return cy.get('@foundFileFolder')
  }

  #getPageName() {
    cy.getElementWithLabel('Resources', '.cec-px-6.py-4')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('pageName')
      })
    return cy.get('@pageName')
  }

  isFacilitatorPage() {
    this.#getPageName().then((text) => {
      cy.wrap(text.includes(ResourceConstant.FACILITATOR_RESOURCES)).as('pageFacilitator')
    })
    return cy.get('@pageFacilitator')
  }

  getInputFolderName() {
    return cy.getInputByPlaceholder(ResourceConstant.ENTER_FOLDER_NAME)
  }

  getBreadcrumbRoot() {
    return cy.getElementWithLabel('Resources', '.cec-px-6.py-4 a')
  }
}
