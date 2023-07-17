class ProductSubscription {
  _expectProductSubscriptionPage() {
    cy.url().should('contain', '/u/notify-subscription')
    cy.get('#portlet_productSubscriptionPortlet').within(() => {
      cy.expectElementWithLabelVisible('Product Subscription', 'h2')
      this.#expectSelectSubscriptionType()
    })
  }
  #expectSelectSubscriptionType() {
    cy.cecCardBody().within(() => {
      cy.expectElementWithLabelVisible('Select Subscription Type', 'h1')
      cy.get('.cec-selectable').as('subscriberCard')
    })
    cy.get('@subscriberCard')
      .eq(0)
      .within(() => {
        cy.expectElementWithLabelVisible('Subscriber', '.card-text')
        cy.expectElementWithLabelVisible('Recommended', '.badge-warning')
        cy.expectElementWithLabelVisible('$65.00/yearly plan', '.price')
      })
    cy.get('@subscriberCard')
      .eq(1)
      .within(() => {
        cy.expectElementWithLabelVisible('Subscriber', '.card-text')
        cy.expectElementWithLabelNotExist('Recommended', '.badge-warning')
        cy.expectElementWithLabelVisible('$15.00/monthly plan', '.price')
      })

    cy.get(`a:contains("Back to Previous Page")`).should('be.visible')
    cy.buttonDisabled('Proceed to Checkout')
  }
}
export default ProductSubscription
