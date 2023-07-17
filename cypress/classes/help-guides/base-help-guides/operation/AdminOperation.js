import AdminHelpGuideIntercept from './AdminHelpGuideIntercept'

class AdminOperation {
  constructor() {
    this.itcAdminHelpGuide = AdminHelpGuideIntercept()
  }
  static clickNewArticleButton() {
    cy.get('button').contains('New article').click()
    this.itcAdminHelpGuide.waitInterceptAdmin()
  }
  static clickPublish() {
    cy.get('.d-md-flex > .cec-card__title > .d-flex').find('button').click()
    this.itcAdminHelpGuide.waitInterceptAdmin()
  }
}

export default AdminOperation
