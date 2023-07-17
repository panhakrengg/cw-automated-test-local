class ManageCourseQueries {
  getManageCourseUrl() {
    return `/manage-courses`
  }

  getCourseByName(courseName) {
    return cy.get(`a:contains('${courseName}')`).parents('.row.mt-4')
  }

  getCourseInstanceTableByCourse(courseName) {
    this.getCourseByName(courseName).within(() => {
      cy.get('.course-instance-list').as('table')
    })
    return cy.get('@table')
  }

  getCourseInstanceByInstanceTitle(courseName, instanceTitle) {
    cy.wrap([]).as('rowData')
    this.getCourseInstanceTableByCourse(courseName).within(($table) => {
      if ($table.find(`span[title="${instanceTitle}"]`).length) {
        cy.wrap($table).get(`span[title="${instanceTitle}"]`).parent().parent().as('rowData')
      }
    })
    return cy.get('@rowData')
  }
}

export default ManageCourseQueries
