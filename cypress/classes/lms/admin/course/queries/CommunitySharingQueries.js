import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'
import { ComSharingConstant } from '../constant/CommunitySharingConstant'

export default class CommunitySharingQueries {
  getUrl(courseId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=course-sharing`
  }

  #getToggle(label) {
    return cy.getElementWithLabel(label, '.justify-content-between').cwToggleButton()
  }

  getToggleCommunitySharing() {
    return this.#getToggle(ComSharingConstant.COMMUNITY_SHARING)
  }

  getToggleAllowDuplicate() {
    return this.#getToggle(ComSharingConstant.ALLOW_DUPLICATE)
  }

  getToggleRequirePermission() {
    return this.#getToggle(ComSharingConstant.REQUIRE_PERMISSION)
  }

  getSharedCommunitiesList() {
    return cy.get('.shared-communities-list')
  }

  getCommunityByName(name) {
    return cy.getElementWithLabel(name, '.shared-communities-list .cec-py-3')
  }

  getTabMenu(tab) {
    return cy.getElementWithLabel(tab, '.tab-menu')
  }

  getTabMenuApproved() {
    this.getTabMenu(ComSharingConstant.APPROVED)
  }

  getTabMenuPending() {
    this.getTabMenu(ComSharingConstant.PENDING)
  }

  getTabMenuSuggested() {
    this.getTabMenu(ComSharingConstant.SUGGESTED)
  }

  getButtonSuggestToCommunities() {
    return cy.getButtonByName(ComSharingConstant.SUGGEST_TO_COMMUNITY)
  }

  getRadioAllCourseInstances() {
    return cy.getRadioButton(ComSharingConstant.ALL_COURSE_INSTANCES)
  }

  getRadioSpecificCourseInstances() {
    return cy.getRadioButton(ComSharingConstant.SPECIFIC_COURSE_INSTANCES)
  }
}
