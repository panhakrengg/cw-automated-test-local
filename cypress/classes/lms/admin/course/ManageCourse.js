import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'

class ManageCourse {
  #courseName
  #itcFetchTotalManageCourse = new InterceptReq('/manage_courses/fetch_total', 'FetchManageCourse ')
  #itcFetchManageCourse = new InterceptReq('/manage_courses/fetch', 'FetchManageCourse ')

  setCourseName(name) {
    this.#courseName = name
  }

  setItcFetchManageCourse() {
    this.#itcFetchManageCourse.set()
  }
  waitItcFetchManageCourse() {
    this.#itcFetchManageCourse.wait()
  }

  getManageCourseUrl() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses`
  }

  visitManageCourse(url = this.getManageCourseUrl()) {
    this.#itcFetchTotalManageCourse.set()
    this.#itcFetchManageCourse.set()
    cy.visit(url)
    this.#itcFetchTotalManageCourse.wait()
    this.waitItcFetchManageCourse()
  }

  defineAliasCourseCard() {
    if (this.#courseName)
      cy.getElementWithLabel(this.#courseName, 'a')
        .parents('.border-bottom-style-dash')
        .as('manageCourseCard')
  }

  selectAllInstances() {
    this.setItcFetchManageCourse()
    cy.get('.cw-learning-dropdown__wrapper').first().clickCwSplitDropdownToggle(Field.ALL)
    this.waitItcFetchManageCourse()
  }

  searchCourse() {
    cy.inputByPlaceholder('Search courses', `"${this.#courseName}"{enter}`)
    this.waitItcFetchManageCourse()
    cy.waitLoadingOverlayNotExist()
    this.defineAliasCourseCard()
  }

  searchCourseInAllInstance() {
    this.selectAllInstances()
    this.searchCourse()
  }
}
export default ManageCourse
