import Field from '../../../../constants/Field'
import ManageCourseInstanceActions from '../actions/ManageCourseInstanceActions'
import ManageCourseInstanceQueries from '../queries/ManageCourseInstanceQueries'

class ManageCourseInstanceAssertions extends ManageCourseInstanceQueries {
  manageCourseInstanceActions = new ManageCourseInstanceActions()

  expectToSeeCorrectTotalArchivedInstance() {
    super.getTotalArchived().then(($total) => {
      super.getAllArchivedCourseInstances().then(($instance) => {
        expect($instance.length).to.eql(parseInt($total))
      })
    })
  }

  expectToSeeArchivedCourseInstanceContainsStatus(title) {
    super
      .getArchivedCourseInstanceByTitle(title)
      .should('contain.text', Field.ARCHIVED)
      .should('not.contain.text', Field.DRAFT)
      .and('be.visible')
  }

  expectToSeeActiveCourseInstanceContainsStatus(title) {
    super
      .getActiveCourseInstanceByTitle(title)
      .should('contain.text', Field.DRAFT)
      .and('not.contain.text', Field.ARCHIVED)
      .and('be.visible')
  }

  expectToSeeCourseInstanceDetailsByInstanceTitle(instanceObj) {
    const title = instanceObj.title.value
    super.getActiveCourseInstanceByTitle(title).within(() => {
      cy.expectElementWithLabelVisible(title, 'td:nth-child(1)')
      cy.expectElementWithLabelVisible(instanceObj.date, 'td:nth-child(2)')
      cy.expectElementWithLabelVisible(instanceObj.location, 'td:nth-child(3)')
      cy.expectElementWithLabelVisible(instanceObj.deliveryMethod, 'td:nth-child(4)')
      cy.expectElementWithLabelVisible(instanceObj.status, 'td:nth-child(5)')
      cy.getThreeDots().should('be.visible')
    })
  }
}

export default ManageCourseInstanceAssertions
