import InterceptReq from '../base/InterceptReq'

class InstanceDetails {
  _itcFetchCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/fetch',
    'fetchCourseActivities'
  )
  _itcFetchCourseCatalog = new InterceptReq('/course_catalog/search', 'fetchCourseCatalog')
  clickOnBackLink() {
    this._itcFetchCourseCatalog.set()
    cy.clickBackLink()
    this._itcFetchCourseCatalog.wait()
  }
  verifyOverview(courseName, instance) {
    cy.cecCard()
      .cardMainContent()
      .within(() => {
        cy.get('.cec-card__title > span.text-uppercase').should('contain.text', courseName)
        cy.getElementWithLabel('Course date:', 'span').next().should('contain.text', instance.date)
        cy.getElementWithLabel('Delivery Methods:', 'span').should(
          'contain.text',
          instance.deliveryMethod
        )
      })
    cy.get('.cw-toggle-button > label > input').should('be.checked')
  }
}

export default InstanceDetails
