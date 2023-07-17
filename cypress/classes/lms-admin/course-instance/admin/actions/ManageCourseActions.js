import Field from '../../../../constants/Field'
import { Lms } from '../../../../constants/Lms'
import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'
import ManageCourseInstanceItc from '../intercepts/ManageCourseInstanceItc'
import ManageCourseItc from '../intercepts/ManageCourseItc'
import ModifyCourseInstanceItc from '../intercepts/ModifyCourseInstanceItc'
import ManageCourseQueries from '../queries/ManageCourseQueries'

class ManageCourseActions extends ManageCourseQueries {
  visitManageCourse() {
    ManageCourseItc.itcFetchManageCourse.set()
    cy.visit(OrgConst.FIRE_CLOUD_FULL_CATALOG_URL + super.getManageCourseUrl())
    ManageCourseItc.itcFetchManageCourse.wait()
  }

  #selectFilterByStatus(status) {
    ManageCourseInstanceItc.itcFetchManageCourse.set()
    cy.get('.cw-learning-dropdown__wrapper').first().clickCwSplitDropdownToggle(status)
    ManageCourseInstanceItc.itcFetchManageCourse.wait()
  }

  selectFilterByArchived() {
    this.#selectFilterByStatus(Field.ARCHIVED)
  }

  selectFilterByDraft() {
    this.#selectFilterByStatus(Field.DRAFT)
  }

  selectFilterByAll() {
    this.#selectFilterByStatus(Field.ALL)
  }

  searchCourse(courseName) {
    ManageCourseInstanceItc.itcFetchManageCourse.set()
    cy.inputByPlaceholder('Search courses', `"${courseName}"{enter}`)
    ManageCourseInstanceItc.itcFetchManageCourse.wait()
    cy.waitLoadingOverlayNotExist()
  }

  #clickCourseThreeDotItem(courseName, threeDotItem) {
    super
      .getCourseByName(courseName)
      .find('.pull-right')
      .within(($threeDot) => {
        cy.wrap($threeDot).clickDropdownItem(threeDotItem)
      })
  }

  clickThreeDotCreateCourseInstanceForCourse(courseName) {
    ModifyCourseInstanceItc.itcCourseInstanceOptions.set()
    this.#clickCourseThreeDotItem(courseName, Lms.createAnInstance)
    ModifyCourseInstanceItc.itcCourseInstanceOptions.wait()
  }
}

export default ManageCourseActions
