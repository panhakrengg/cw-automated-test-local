import UserRole from '../../../utilities/user-role/UserRole'
import Navigation from '../../admin/Navigation'
import AdminHelpGuideIntercept from '../operation/AdminHelpGuideIntercept'

class AdminHelpGuideLogin {
  constructor() {
    this.tabNav = new Navigation()
    this.itcAdminHelpGuide = new AdminHelpGuideIntercept()
  }
  initTable(name) {
    cy.cwTable(name)
  }
  initTableAlias(urlName) {
    let tableAlias = 'cwTable'
    if (urlName == 'articles') {
      tableAlias = 'tableArticle'
    } else if (urlName == 'roles' || urlName == 'topics') {
      tableAlias = 'tableTopicRole'
    }
    this.initTable(tableAlias)
  }
  waitHelpGuideAdminPage(urlName) {
    this.itcAdminHelpGuide.waitIntercept(urlName)
    this.initTableAlias(urlName)
    cy.wait(3000)
    cy.waitPortletReady()
  }
  signInAsAdminToTab(urlName = 'articles') {
    this.visitAdminTabByRole(urlName, 'HelpGuideUsers.admin')
  }
  signInAsOrgAdminToTab(urlName = 'articles') {
    this.visitAdminTabByRole(urlName, UserRole.ORG_ADMIN.ORGANIZATION)
  }
  signInAsAdminAndOrgAdminToTab(urlName = 'articles') {
    this.visitAdminTabByRole(urlName, 'HelpGuideUsers.admin', 1, 1)
  }
  signInAsAdminTwoOrgToTab(urlName = 'articles') {
    this.visitAdminTabByRole(urlName, UserRole.ORG_ADMIN.TWO_ORGANIZATION)
  }
  signInAsFrontierOrgAdminToTab(urlName = 'articles') {
    this.visitAdminTabByRole(urlName, UserRole.DEMO_FRONTIER_USERS.ADMIN)
  }
  signInAsHelpGuideTwoOrgAdminToTab(urlName = 'articles') {
    this.visitAdminTabByRole(urlName, 'HelpGuideUsers.admin', 3, 3)
  }
  visitAdminTabByRole(urlName, role, emailIndex = 0, screenNameIndex = 0) {
    this.itcAdminHelpGuide.interceptList()
    cy.visitThenSignIn(this.tabNav.getUrl(urlName), role, emailIndex, screenNameIndex)
    this.waitHelpGuideAdminPage(urlName)
  }
}

export default AdminHelpGuideLogin
