import ManageCourseQueries from '../queries/ManageCourseQueries'

class ManageCourseAssertions extends ManageCourseQueries {
  expectToSeeCourseContainsInstanceWithTitle(courseName, courseInstanceTitle) {
    super.getCourseInstanceTableByCourse(courseName).within(() => {
      cy.expectElementWithLabelVisible(courseInstanceTitle, 'span')
    })
  }

  expectToSeeCourseContainsInstanceWithStatus(courseName, courseInstanceTitle, status) {
    super.getCourseInstanceTableByCourse(courseName).within(($table) => {
      cy.wrap($table)
        .get(`span[title="${courseInstanceTitle}"]`)
        .parent()
        .parent()
        .should('contain.text', status)
        .and('be.visible')
    })
  }

  expectToSeeCourseInstanceDetails(courseName, instanceObj) {
    super
      .getCourseInstanceByInstanceTitle(courseName, instanceObj.title.value)
      .within(($instance) => {
        if (instanceObj.title.value)
          cy.expectElementWithLabelVisible(instanceObj.title.value, 'span')
        if (instanceObj.date) cy.expectElementWithLabelVisible(instanceObj.date, 'span')
        if (instanceObj.location) cy.expectElementWithLabelVisible(instanceObj.location, 'span')
        if (instanceObj.deliveryMethod)
          cy.expectElementWithLabelVisible(instanceObj.deliveryMethod, 'td')
        if (instanceObj.status) cy.expectElementWithLabelVisible(instanceObj.status, 'span')
      })
  }
}

export default ManageCourseAssertions
