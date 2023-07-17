class MyLearningAction {
  clickBrowserCourseCatalog() {
    cy.get('.col-md-9 .empty-result > .btn').click()
  }
}

export default MyLearningAction
