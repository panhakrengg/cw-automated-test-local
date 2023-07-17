class InstanceOverview {
  verifyInstanceDetails(instanceObj, courseObj) {
    const instanceTitle = instanceObj.title.value
    const courseName = courseObj.name.value
    const fullTitle = instanceTitle ? courseName + ' - ' + instanceTitle : courseName
    cy.get('.cec-card__header .cec-card__title')
      .last()
      .within(() => {
        cy.get('span.text-uppercase').should('have.text', fullTitle)
      })
    cy.get('#_learningAdminManageCoursesPortlet_viewDetailToggle').within(() => {
      cy.expectElementWithLabelVisible(`Duration:`, '.property')
      cy.expectElementWithLabelVisible(` ${instanceObj.courseCompletion} Hours`, '.property')
      cy.expectElementWithLabelVisible(`Course Fee :`, '.price-wrapper')
      cy.expectElementWithLabelVisible(`USD ${instanceObj.courseFee.value}`, '.price-wrapper')
      cy.expectElementWithLabelVisible(`Delivery Methods:`, '.property')
      cy.expectElementWithLabelVisible(instanceObj.deliveryMethod, '.property')
      cy.expectElementWithLabelVisible(`Language:`, '.property')
      cy.expectElementWithLabelVisible(instanceObj.language[0], '.property')
    })
    cy.expectElementWithLabelVisible('No course activity added yet.', 'p')
    cy.expectElementWithLabelVisible('Go to course activity', 'button')
  }
}

export default InstanceOverview
