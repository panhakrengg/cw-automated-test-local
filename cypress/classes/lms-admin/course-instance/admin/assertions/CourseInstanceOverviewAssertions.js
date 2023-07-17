import CourseInstanceOverviewQueries from '../queries/CourseInstanceOverviewQueries'

class CourseInstanceOverviewAssertions extends CourseInstanceOverviewQueries {
  expectToSeeCourseInstanceTitle(courseName, instanceTitle) {
    const fullTitle = instanceTitle ? courseName + ' - ' + instanceTitle : instanceTitle
    super.getCourseInstanceTitle().last().should('have.text', fullTitle).and('be.visible')
  }

  expectToSeeInstanceDetails(instanceObj, courseName) {
    const instanceTitle = instanceObj.title.value
    const fullTitle = instanceTitle ? courseName + ' - ' + instanceTitle : instanceTitle
    cy.get('.cec-card__header .cec-card__title')
      .last()
      .within(() => {
        cy.get('span.text-uppercase').should('have.text', fullTitle)
      })
    cy.get('#_learningAdminManageCoursesPortlet_viewDetailToggle').within(() => {
      if (instanceObj.courseCompletion) {
        cy.expectElementWithLabelVisible(`Duration:`, '.property')
        cy.expectElementWithLabelVisible(`${instanceObj.courseCompletion}`, '.property')
      }
      if (instanceObj.courseFee) {
        cy.expectElementWithLabelVisible(`Course Fee :`, '.price-wrapper')
        cy.expectElementWithLabelVisible(`${instanceObj.courseFee.value}`, '.price-wrapper')
      }
      if (instanceObj.deliveryMethod) {
        cy.expectElementWithLabelVisible(`Delivery Methods:`, '.property')
        cy.expectElementWithLabelVisible(instanceObj.deliveryMethod, '.property')
      }
      if (instanceObj.language) {
        const languages = instanceObj.language
        cy.expectElementWithLabelVisible(
          languages.length > 1 ? `Languages:` : `Language:`,
          '.property'
        )
        instanceObj.language.forEach((language) => {
          cy.expectElementWithLabelVisible(language, '.property')
        })
      }
    })
    cy.expectElementWithLabelVisible('No course activity added yet.', 'p')
    cy.expectElementWithLabelVisible('Go to course activity', 'button')
  }

  expectToSeeActivityWithTitle(title) {
    cy.get(
      '#_learningAdminManageCoursesPortlet_activityAccordion, #_copMemberManagementPortlet_activityAccordion'
    ).within(() => {
      cy.expectElementWithLabelVisible(title, 'span.text-black')
    })
  }
}

export default CourseInstanceOverviewAssertions
