export class RequestAccess {
  clickButtonRequestToJoinCommunity() {
    cy.scrollTo('bottom')
    cy.wait(6000)
    cy.get('#_copSubscriptionRequestPortlet_subscriptionRequest').clickLinkByName('Request to Join')
  }
  submitRequestToJoinCommunity() {
    cy.clickConfirmPopUp('Submit')
  }
  fillInInformation(user) {
    cy.swal2().within(() => {
      if (user.firstName) cy.inputByPlaceholder('Enter your first name', user.firstName)
      if (user.lastName) cy.inputByPlaceholder('Enter your last name', user.lastName)
      if (user.email) cy.inputByPlaceholder('Enter your email address', user.email)
    })
  }
}
