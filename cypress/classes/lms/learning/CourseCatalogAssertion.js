class CourseCatalogAssertion {
  courseCatalog = 'Course Catalog'
  expectCourseCatalogCount() {
    cy.contains(new RegExp(`${this.courseCatalog} .*\(\\d+\)`)).should('have.length.gt', 0)
  }
  toggleSelectedCourseCatalog() {
    cy.getDropdownToggle().find(`div[title="${this.courseCatalog}"]`)
    cy.getDropdownToggle().find(`div.text-truncate span:contains(${this.courseCatalog})`)
  }
}

export default CourseCatalogAssertion
