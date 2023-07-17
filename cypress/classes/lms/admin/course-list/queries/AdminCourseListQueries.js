import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'

export default class AdminCourseListQueries {
  getUrlOrgLms() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses`
  }

  getUrlCop(copUrl) {
    return `${copUrl}/admin/admin#_copMemberManagementPortlet_option=manage-courses`
  }

  getLearningDropdownWrapper() {
    return cy.get('.cw-learning-dropdown__wrapper').first()
  }

  getInputSearchCourse() {
    return cy.getInputByPlaceholder('Search courses')
  }

  getLearningAdminManageCoursesPortlet() {
    return cy
      .get('#_learningAdminManageCoursesPortlet_manageCourses, #_copMemberManagementPortlet_admin')
      .find('.position-relative')
      .first()
  }

  findCourse(courseName) {
    this.getLearningAdminManageCoursesPortlet().then(($portlet) => {
      cy.wrap($portlet.find(`a:contains("${courseName}")`).length > 0).as('foundCourse')
    })
    return cy.get('@foundCourse')
  }

  getCourseCard(courseName) {
    return cy.getElementWithLabel(courseName, '.border-bottom-style-dash.col')
  }

  getPortletCourseSuggestion() {
    return cy.get('#_copMemberManagementPortlet_collapseSuggest')
  }

  getButtonAddToYourCatalog() {
    return cy.getButtonByName('Add to your catalog')
  }

  getLinkDeclineCourse() {
    return cy.getElementWithLabel('Decline Course', 'a')
  }

  getButtonCreateNewCourse() {
    return cy.getButtonByName('Create New Course')
  }

  getCardAddExistingCourse() {
    return cy.getElementWithLabel('Add Existing Course','.card-horizontal')
  }
}
