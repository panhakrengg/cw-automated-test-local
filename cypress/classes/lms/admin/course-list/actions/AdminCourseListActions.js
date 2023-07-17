import Field from '../../../../constants/Field'
import ModifyCourseActions from '../../course/actions/ModifyCourseActions'
import AdminCourseListItc from '../intercepts/AdminCourseListItc'
import AdminCourseListQueries from '../queries/AdminCourseListQueries'

export default class AdminCourseListActions extends AdminCourseListQueries {
  visitOrgLms() {
    cy.visit(super.getUrlOrgLms())
  }

  visitCop(copUrl) {
    AdminCourseListItc.fetchCopInfoAdmin.set()
    AdminCourseListItc.fetchManageCourse.set()
    cy.visit(super.getUrlCop(copUrl))
    AdminCourseListItc.fetchCopInfoAdmin.wait()
    AdminCourseListItc.fetchManageCourse.wait()
  }

  #selectAllInstances() {
    AdminCourseListItc.fetchManageCourse.set()
    super.getLearningDropdownWrapper().clickCwSplitDropdownToggle(Field.ALL)
    AdminCourseListItc.fetchManageCourse.wait()
  }

  #searchCourse(name) {
    AdminCourseListItc.fetchManageCourse.set()
    super.getInputSearchCourse().clear().type(`"${name}"{enter}`)
    AdminCourseListItc.fetchManageCourse.wait()
    cy.waitLoadingOverlayNotExist()
  }

  searchCourseInAll(name) {
    this.#selectAllInstances()
    this.#searchCourse(name)
  }

  #clickButtonYesDeleteCourse() {
    AdminCourseListItc.deleteCourse.set()
    AdminCourseListItc.fetchManageCourse.set()
    cy.clickButtonByName(Field.YES_DELETE)
    AdminCourseListItc.deleteCourse.wait()
    AdminCourseListItc.fetchManageCourse.wait()
    cy.waitLoadingOverlayNotExist()
  }

  deleteCourse(name) {
    super
      .getCourseCard(name)
      .first()
      .within(($card) => {
        cy.waitLoadingOverlayNotExist()
        cy.wrap($card).clickDropdownItem(Field.DELETE)
      })
    this.#clickButtonYesDeleteCourse()
  }

  deleteCourseIfExist(name) {
    this.searchCourseInAll(name)
    super.findCourse(name).then(($found) => {
      if ($found) this.deleteCourse(name)
    })
  }

  createCourseIfNotExist(course) {
    const { name } = course
    const action = new ModifyCourseActions()
    super.findCourse(name).then(($found) => {
      if (!$found) {
        action.visitCreateCourseOrgLms()
        action.createNewCourse(course)
        this.visitOrgLms() // Go back to Course List & search course
        this.searchCourseInAll(name)
      }
    })
  }

  #expandCourseSuggestion() {
    super.getPortletCourseSuggestion().click()
  }

  #clickButtonAddToYourCourse(name) {
    AdminCourseListItc.fetchCourseManageCourses.set()
    AdminCourseListItc.fetchPermissionAdmin.set()
    cy.getElementWithLabel(name, '.accordion-body .row').within(() =>
      super.getButtonAddToYourCatalog(name).click()
    )
    AdminCourseListItc.fetchCourseManageCourses.wait()
    AdminCourseListItc.fetchPermissionAdmin.wait()
  }

  #clickLinkDeclineCourse(name) {
    AdminCourseListItc.removeSharedCourseAdmin.set()
    cy.getElementWithLabel(name, '.accordion-body .row').within(() =>
      super.getLinkDeclineCourse(name).click()
    )
    AdminCourseListItc.removeSharedCourseAdmin.wait()
  }

  approveShareCourse(name) {
    this.#expandCourseSuggestion()
    this.#clickButtonAddToYourCourse(name)
  }

  declineShareCourse(name) {
    this.#expandCourseSuggestion()
    this.#clickLinkDeclineCourse(name)
  }

  #clickButtonCreateNewCourseInCop() {
    super.getButtonCreateNewCourse().click()
  }

  #clickButtonNextToAddExistingCourse() {
    AdminCourseListItc.searchSharedCourse.set()
    cy.clickButtonByName(Field.NEXT)
    AdminCourseListItc.searchSharedCourse.wait()
  }

  #searchSharedCourseThenSelect(name) {
    AdminCourseListItc.searchSharedCourse.set()
    cy.inputSearch().type(`"${name}"{enter}`)
    AdminCourseListItc.searchSharedCourse.wait()
    cy.waitLoadingOverlayNotExist()

    cy.getElementWithLabel(name, '.card-horizontal').click()
  }

  #clickButtonAdd() {
    AdminCourseListItc.fetchCourseManageCourses.set()
    AdminCourseListItc.fetchPermissionAdmin.set()
    cy.clickButtonByName(Field.ADD)
    AdminCourseListItc.fetchCourseManageCourses.wait()
    AdminCourseListItc.fetchPermissionAdmin.wait()
  }

  addExistingCourse(name) {
    this.#clickButtonCreateNewCourseInCop()
    cy.swal2().within(() => {
      super.getCardAddExistingCourse().click()
      this.#clickButtonNextToAddExistingCourse()
      this.#searchSharedCourseThenSelect(name)
      this.#clickButtonAdd()
    })
  }
}
