class CourseInstanceQueries {
  getSideBar() {
    return cy.cecCard().cardRightContent().find('.cec-sidebar')
  }
}

export default CourseInstanceQueries
