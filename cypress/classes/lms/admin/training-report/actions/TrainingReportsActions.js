import DateFormat from '../../../../format-collections/DateFormat'
import DateUtil from '../../../../utilities/DateUtil'
import TrainingReportsIntercepts from '../intercepts/TrainingReportsIntercepts'
import TrainingReportsQueries from '../queries/TrainingReportsQueries'

export default class TrainingReportsActions extends TrainingReportsQueries {
  visitTopLevel() {
    TrainingReportsIntercepts.getTrainingReport.set()
    cy.visit(super.getUrlOrgLms())
    TrainingReportsIntercepts.getTrainingReport.wait()
  }

  clickNavButtonAdvancedFilters() {
    super.getNavButtonAdvancedFilters().click()
  }
  clickButtonClearFilter() {
    super.getButtonClearFilter().click()
  }

  #clickDropdownToggleCourses() {
    super.getDropdownToggleCourses().click()
  }

  #clickDropdownToggleCategoryCommunity() {
    super.getDropdownToggleCategoryCommunity().click()
  }

  #clickDropdownToggleDeliveryMethods() {
    super.getDropdownToggleDeliveryMethods().click()
  }

  #clickDropdownToggleCourseStatus() {
    super.getDropdownToggleCourseStatus().click()
  }

  #selectItemsByIndexes(element, indexes) {
    element.within(() => {
      indexes.forEach((index) => {
        cy.getCheckbox().eq(index).check()
      })
    })
  }

  clickButtonApply() {
    super.getButtonApply().click()
  }

  #waitReportLoading(callback = () => {}) {
    TrainingReportsIntercepts.getTrainingReport.set()
    callback()
    cy.expectOverlayIsVisible()
    cy.waitLoadingOverlayNotExist()
    TrainingReportsIntercepts.getTrainingReport.wait()
  }

  applyFilter() {
    this.#waitReportLoading(() => {
      this.clickButtonApply()
    })
  }

  #selectItemsByLabel(element, label) {
    element.within(() => {
      cy.checkboxByLabel(label).check()
    })
  }

  selectCourseDropdownByIndex(indexes = [0]) {
    this.#clickDropdownToggleCourses()
    this.#selectItemsByIndexes(super.getDropdownToggleCourses(), indexes)
    this.#clickDropdownToggleCourses()
  }

  selectCourseDropdownByName(label) {
    this.#clickDropdownToggleCourses()
    this.#selectItemsByLabel(super.getDropdownToggleCourses(), label)
    this.#clickDropdownToggleCourses()
  }

  selectCategoryCommunityDropdownByIndex(indexes = [0]) {
    this.#clickDropdownToggleCategoryCommunity()
    this.#selectItemsByIndexes(super.getDropdownToggleCategoryCommunity(), indexes)
    this.#clickDropdownToggleCategoryCommunity()
  }

  #selectDeliveryMethodsDropdownByIndex(indexes = [0]) {
    this.#clickDropdownToggleDeliveryMethods()
    this.#selectItemsByIndexes(super.getDropdownToggleDeliveryMethods(), indexes)
    this.#clickDropdownToggleDeliveryMethods()
  }

  #selectCourseStatusDropdownByIndex(indexes = [0]) {
    this.#clickDropdownToggleCourseStatus()
    this.#selectItemsByIndexes(super.getDropdownToggleCourseStatus(), indexes)
    this.#clickDropdownToggleCourseStatus()
  }

  select5ItemsPerPage() {
    this.#waitReportLoading(() => {
      cy.selectItemPerPage(5)
    })
  }

  select75ItemsPerPage() {
    this.#waitReportLoading(() => {
      cy.selectItemPerPage(75)
    })
  }

  tickCheckboxShowLearnersWhoHaveNotBookedCourse() {
    super.getCheckboxShowLearnersWhoHaveNotBookedCourse().check()
  }

  reloadTrainingReports() {
    TrainingReportsIntercepts.getFilterOptions.set()
    TrainingReportsIntercepts.getTrainingReport.set()
    cy.reload()
    TrainingReportsIntercepts.getFilterOptions.wait()
    TrainingReportsIntercepts.getTrainingReport.wait()
  }

  #fillCurrentDate() {
    const date = new DateUtil().getCurrentDate(DateFormat.TRAINING_REPORT_FILTER)

    super.getInputStartDate().click()
    super.getDatePicker(date).first().click()

    super.getInputEndDate().click()
    super.getDatePicker(date).last().click()
  }

  fillAdvancedFilter(info, currentDate) {
    const {
      learnerName,
      courseIndex,
      courseName,
      categoryIndex,
      deliveryMethodIndex,
      startDate,
      endDate,
      location,
      completionStatusIndex,
      showLearnersNotBook,
    } = info

    if (learnerName) super.getInputLearnerName().clear().type(learnerName)
    if (courseIndex) this.selectCourseDropdownByIndex(courseIndex)
    if (courseName) this.selectCourseDropdownByName(courseName)
    if (categoryIndex) this.selectCategoryCommunityDropdownByIndex(categoryIndex)
    if (deliveryMethodIndex) this.#selectDeliveryMethodsDropdownByIndex(deliveryMethodIndex)
    if (currentDate) this.#fillCurrentDate()
    else {
      if (startDate) super.getInputStartDate().type(startDate, { force: true })
      if (endDate) super.getInputEndDate().type(endDate, { force: true })
    }
    if (location) super.getInputLocation().clear().type(location)
    if (completionStatusIndex) this.#selectCourseStatusDropdownByIndex(completionStatusIndex)
    if (showLearnersNotBook) this.tickCheckboxShowLearnersWhoHaveNotBookedCourse()
  }

  clickIconToCollapse() {
    super.getIconCollapse().click()
  }

  clickIconToCollapseByIndex(index = 0) {
    super.getIconCollapseByIndex(index).click()
  }

  #clickIconManageColumn() {
    super.getIconManageColumn().click()
  }

  #selectColumnInPopup(columns) {
    cy.getPopup().within(() => {
      columns.forEach((col) => cy.checkboxByLabel(col).check())
    })
  }

  #unselectColumnInPopup(columns) {
    cy.getPopup().within(() => {
      columns.forEach((col) => cy.checkboxByLabel(col).uncheck())
    })
  }

  #clickButtonSet() {
    super.getButtonSet().click()
  }

  addAndRemoveColumns(addCol, removeCol) {
    this.#clickIconManageColumn()
    this.#selectColumnInPopup(addCol)
    this.#unselectColumnInPopup(removeCol)
    this.#clickButtonSet()
  }

  addColumns(columns) {
    this.#clickIconManageColumn()
    this.#selectColumnInPopup(columns)
    this.#clickButtonSet()
  }

  removeColumns(columns) {
    this.#clickIconManageColumn()
    this.#unselectColumnInPopup(columns)
    this.#clickButtonSet()
  }

  searchCoursesLearners(value) {
    this.#waitReportLoading(() => {
      super.getInputSearchCoursesLearners().clear().type(`${value}{enter}`)
    })
  }

  searchLearners(learner) {
    this.#waitReportLoading(() => {
      super.getInputSearchLearners().clear().type(`${learner}{enter}`)
    })
  }
}
