import InstanceOverviewQueries from '../queries/InstanceOverviewQueries'

class InstanceOverviewAssertions extends InstanceOverviewQueries {
  expectToSeeCourseInstanceTitle(courseName, courseInstanceTitle) {
    const title = courseInstanceTitle ? courseName + ' - ' + courseInstanceTitle : courseName
    super.getCourseInstanceHeader().last().should('have.text', title).and('be.visible')
  }
  expectNotToSeeAnnouncement() {
    super.getCourseAnnouncement().should('not.exist')
  }
  expectToSeeAnnouncement(announcementBody) {
    super
      .getCourseAnnouncement()
      .should('be.visible')
      .within(() => {
        cy.getElementWithLabel(announcementBody, '.text-center')
      })
  }
}

export default InstanceOverviewAssertions
