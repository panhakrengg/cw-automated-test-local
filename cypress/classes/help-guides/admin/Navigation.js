import AdminHelpGuideIntercept from '../base-help-guides/operation/AdminHelpGuideIntercept'
import TopicRole from './TopicRole'

class Navigation {
  constructor() {
    this.itcAdminHelpGuide = new AdminHelpGuideIntercept()
  }

  interceptSidebarItems() {
    this._itcSidebar.set()
    this.itcAdminHelpGuide.itcSidebarSet()
  }
  waitSidebarItems() {
    this.itcAdminHelpGuide.itcSidebarWait()
  }

  initNavigation() {
    cy.cecCardBody().find('.nav').as('navigation')
  }
  visitTopic(tabName = 'topics') {
    cy.visit(this.getUrl(tabName))
  }
  visitBanner(tabName = 'banner') {
    cy.visit(this.getUrl(tabName))
  }
  visitRoles(tabName = 'roles') {
    cy.visit(this.getUrl(tabName))
  }
  getUrl(tabName) {
    return `/web/help-guide/admin#_helpGuideAdminPortlet_tab=${tabName}`
  }
  clickNav(tabName = articles) {
    const topicsRoles = new TopicRole()
    this.itcAdminHelpGuide.interceptList()
    this.itcAdminHelpGuide.interceptFetchCategories()
    cy.clickNavigation(tabName)
    if (tabName == 'Topics' || tabName == 'Roles') {
      this.itcAdminHelpGuide.waitFetchCategories()
      topicsRoles.initColumnName()
    } else if (tabName == 'Articles') {
      this.itcAdminHelpGuide.waitList()
    }
  }
  clickBanner() {
    this.clickNav('Banner')
  }
  clickTopics() {
    this.clickNav('Topics')
  }
  clickRoles() {
    this.clickNav('Roles')
  }
  clickArticles() {
    this.clickNav('Articles')
  }
}

export default Navigation
