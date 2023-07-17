import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'

export default class ChangeLogQueries {
  getLearningAdminSettingUrl() {
    return OrgConst.FIRE_CLOUD_FULL_CATALOG_URL + '/settings'
  }

  getUrlCourseLevel(courseId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=change-log`
  }

  getLinkChangeLog() {
    return cy.getElementWithLabel('Change Log', 'a')
  }

  getTitleChangeLog() {
    return cy.get('div.text-black > span')
  }

  getListChangeLogWrapper() {
    return cy.get('.change-log-list-wrapper')
  }

  getAllChangeLogs() {
    this.getListChangeLogWrapper().within(() => {
      cy.get('div.d-flex.cec-py-3').as('changeLogs')
    })
    return cy.get('@changeLogs')
  }

  getFirstChangeLog() {
    return this.getAllChangeLogs().first()
  }

  getLinkCollapseChangeLog() {
    return cy.get('a[aria-controls*="collapseChangeLog"]')
  }

  getCollapseChangeLog() {
    return cy.get('div[id*="collapseChangeLog"]')
  }

  getTabPanelItemRowByLabel(label) {
    return cy.getElementWithLabel(label, 'b').parent().parent()
  }

  getChangeLogByTitleAndIndex(title, index) {
    return this.getAllChangeLogs().filter(`:contains("${title}")`).eq(index)
  }

  getFirstChangeLogByTitle(title) {
    return this.getChangeLogByTitleAndIndex(title, 0)
  }

  getPanelPrevious() {
    return cy.getElementWithLabel('Previous', '.border-rounded')
  }

  getPanelNew() {
    return cy.getElementWithLabel('New', '.border-rounded')
  }

  getLogWithMultiValue(array) {
    let logResult = ''
    array.forEach((value) => (logResult = logResult + `, ${value}`))

    return logResult.substring(2)
  }
}
