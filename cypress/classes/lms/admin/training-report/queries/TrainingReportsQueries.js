import Field from '../../../../constants/Field'
import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'
import { AdvancedFilters, TrainingReportColumns } from '../constants/TrainingReportsConstants'

export default class TrainingReportsQueries {
  getUrlOrgLms() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/training-reports`
  }

  getUrlCourseLevelOrgLms(courseId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=training-reports`
  }

  getUrlInstanceLevelOrgLms(courseId, instanceId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}//manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${instanceId}&_learningAdminManageCoursesPortlet_tab=report&_learningAdminManageCoursesPortlet_courseId=${courseId}`
  }

  getNavButtonAdvancedFilters() {
    return cy.getElementWithLabel(AdvancedFilters.ADVANCED_FILTERS, '.navigation-button button')
  }

  getButtonApply() {
    return cy.getButtonByName(AdvancedFilters.APPLY)
  }

  getButtonClearFilter() {
    return cy.getButtonByName(AdvancedFilters.CLEAR_FILTER)
  }

  #getDropdownByName(name, index = 0) {
    return cy.getElementWithLabel(name, 'label').eq(index).parent()
  }

  getDropdownToggleCourses() {
    return this.#getDropdownByName(AdvancedFilters.COURSES)
  }

  getDropdownToggleCategoryCommunity() {
    return this.#getDropdownByName(AdvancedFilters.CATEGORY_COMMUNITY)
  }

  getDropdownToggleDeliveryMethods() {
    return this.#getDropdownByName(AdvancedFilters.DELIVERY_METHODS, 1)
  }

  getDropdownToggleCourseStatus() {
    return this.#getDropdownByName(AdvancedFilters.COURSE_COMPLETION_STATUS)
  }

  getCheckboxShowLearnersWhoHaveNotBookedCourse() {
    cy.getElementWithLabel(
      AdvancedFilters.SHOW_LEARNERS_WHO_HAVE_NOT_BOOKED_COURSE,
      'label'
    ).within(() => cy.getCheckbox().as('checkboxCourse'))
    return cy.get('@checkboxCourse')
  }

  getCheckboxIncludeLearnersNotOrgMember() {
    cy.getElementWithLabel(AdvancedFilters.INCLUDE_LEARNERS_WHO_NOT_ORG_MEM, 'label').within(() =>
      cy.getCheckbox().as('checkboxCourse')
    )
    return cy.get('@checkboxCourse')
  }

  getInputLearnerName() {
    return cy.getInputFormGroup(AdvancedFilters.LEARNER_NAME)
  }

  getInputStartDate() {
    return cy.getInputByLabel(AdvancedFilters.COURSE_START_DATE)
  }

  getInputEndDate() {
    return cy.getInputByLabel(AdvancedFilters.COURSE_END_DATE)
  }

  getDatePicker(date) {
    return cy.get(`td[title="${date}"]:visible`)
  }

  getInputLocation() {
    return cy.getInputFormGroup(AdvancedFilters.COURSE_LOCATION)
  }

  getTabulatorHeaders() {
    return cy.get('.tabulator-headers')
  }

  getTabulatorRow() {
    return cy.get('.tabulator-tableHolder .tabulator-row')
  }

  getTabulatorCell() {
    return cy.get('.tabulator-cell:visible')
  }

  getTabulatorCellByLabel(label) {
    return cy.getElementWithLabel(label, '.tabulator-cell')
  }

  getTotalRecord() {
    this.getTabulatorRow()
      .its('length')
      .then((length) => cy.wrap(length).as('totalRecord'))
    return cy.get('@totalRecord')
  }

  getSearchResult() {
    return cy.getElementWithLabel('Search results', '.tabulator-header-filter span')
  }

  getSearchResultText() {
    this.getSearchResult()
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('searchResultText')
      })
    return cy.get('@searchResultText')
  }

  getTabulatorRowByLabel(label) {
    return cy.getElementWithLabel(label, '.tabulator-row')
  }

  getTabulatorRowByIndex(index = 0) {
    return this.getTabulatorRow().eq(index)
  }

  getIconCollapse() {
    return cy.get('[tabulator-field="responsiveCollapse"]:visible')
  }

  getIconCollapseByIndex(index) {
    return this.getTabulatorRowByIndex(index).find('[tabulator-field="responsiveCollapse"]')
  }

  getIconManageColumn() {
    return cy.get('[tabulator-field="manageColumnPopupIcon"]:visible')
  }

  getTotalColumnHeader() {
    cy.get('[role="columnheader"]:visible')
      .its('length')
      .then((length) => cy.wrap(length - 1).as('totalHeader')) // ignore manage column icon
    return cy.get('@totalHeader')
  }

  getColumnHeaderWithTitle(title) {
    return cy.getElementWithLabel(title, '.tabulator-col-title')
  }

  getColumnCollapseWithTitle(title) {
    return cy.getElementWithLabel(title, '.tabulator-responsive-collapse')
  }

  getButtonSet() {
    return cy.getButtonByName(Field.SET)
  }

  reorderColumns(columns) {
    let reorderColumn = []
    for (const [key, value] of Object.entries(TrainingReportColumns))
      if (columns.includes(value)) reorderColumn.push(value)

    return reorderColumn
  }

  getInputSearchCoursesLearners() {
    return cy.getInputByPlaceholder(AdvancedFilters.SEARCH_COURSES_OR_LEARNERS)
  }

  getInputSearchLearners() {
    return cy.getInputByPlaceholder('Search learners')
  }
}
