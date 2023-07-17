import ChangeLogItc from '../intercepts/ChangeLogItc'
import ChangeLogQueries from '../queries/ChangeLogQueries'

export default class ChangeLogActions extends ChangeLogQueries {
  visitLearningSetting() {
    ChangeLogItc.itcGetManageStorageOverview.set()
    cy.visit(super.getLearningAdminSettingUrl())
    ChangeLogItc.itcGetManageStorageOverview.wait()
    cy.waitLoadingOverlayNotExist()
  }

  visitCourseLevel(courseId) {
    ChangeLogItc.fetchChangeLogCourseAdmin.set()
    cy.visit(super.getUrlCourseLevel(courseId))
    ChangeLogItc.fetchChangeLogCourseAdmin.wait()
  }

  clickLinkChangeLog(waitNewLogAppear = true) {
    ChangeLogItc.itcFetchChangeLogs.set()
    if (waitNewLogAppear) cy.wait(3000) // wait for change log appearing
    super.getLinkChangeLog().last().should('be.visible').click()
    ChangeLogItc.itcFetchChangeLogs.wait()
  }

  clickLinkChangeLogInCourse(waitNewLogAppear = true) {
    ChangeLogItc.fetchChangeLogCourseAdmin.set()
    if (waitNewLogAppear) cy.wait(3000) // wait for change log appearing
    super.getLinkChangeLog().last().should('be.visible').click()
    ChangeLogItc.fetchChangeLogCourseAdmin.wait()
  }

  clickLinkCollapseChangeLog() {
    super.getLinkCollapseChangeLog().click()
  }

  #clickDropdownFilterByItem(item, intercept = ChangeLogItc.itcFetchChangeLogs) {
    super.getListChangeLogWrapper().within(($list) => {
      intercept.set()
      cy.wrap($list).clickCwDropdownItem(item)
      intercept.wait()
    })
  }

  clickDropdownFilterByCertificateChanges() {
    this.#clickDropdownFilterByItem('Certificate changes')
  }

  clickDropdownFilterByCourseChanges() {
    this.#clickDropdownFilterByItem('Course changes')
  }

  clickDropdownFilterByCourseInstanceChanges() {
    this.#clickDropdownFilterByItem('Course instance changes')
  }

  clickDropdownFilterByCourseChangesInCourse() {
    this.#clickDropdownFilterByItem('Course changes', ChangeLogItc.fetchChangeLogCourseAdmin)
  }

  clickDropdownFilterByLearningPathChanges() {
    this.#clickDropdownFilterByItem('Learning path changes')
  }

  clickDropdownFilterByUserGroupChanges() {
    this.#clickDropdownFilterByItem('User group changes')
  }

  clickDropdownFilterByActivityLibraryChanges() {
    this.#clickDropdownFilterByItem('Activity library changes')
  }
}
