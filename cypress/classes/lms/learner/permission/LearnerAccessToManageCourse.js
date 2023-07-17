import LearningAdmin from '../../LearningAdmin'

class LearnerAccessToManageCourse {
  expectPageNotFoundWhenAccessViaOrgLmsAdminLink(orgFullCatalogId) {
    cy.visit(
      new LearningAdmin().getFullCatalogUrl(orgFullCatalogId) +
        '/manage-courses',
      { failOnStatusCode: false }
    )
    cy.pageNotFound()
  }
  expectPageNotFoundWhenAccessViaInstanceLmsAdminLink() {
    cy.visit('web/full-catalog/manage-courses', { failOnStatusCode: false })
    cy.pageNotFound()
  }
}
export default LearnerAccessToManageCourse
