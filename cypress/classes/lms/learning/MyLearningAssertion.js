class MyLearningAssertion {
  expectToSeePopularCourses() {
    cy.get('div#_myLearningPortlet_courseList').within(() => {
      cy.get('span.header-top-title').should('contain.text', 'Popular Courses')
      cy.get('ul.list-group > li.list-group-item').should('have.length.gte', 5)
    })
  }
  expectMyLearningCount($totalCourse) {
    cy.get('.pr-0 > .font-size-22').contains(`My Learning (${$totalCourse})`)
  }
  expectEmptyStateNotEnroll() {
    cy.get('.col-md-9 .empty-result-message').contains('You currently are not enrolled in any learnings.')
    cy.get('.col-md-9 .empty-result > .btn').contains('Browse Course Catalog').should('be.visible')
  }
}
export default MyLearningAssertion
