class CourseInstanceDetail {
  _clickOnTab(tabName) {
    cy.cecCard().cardRightContent().find(`nav > a:contains("${tabName}")`).click()
  }
}

export default CourseInstanceDetail
