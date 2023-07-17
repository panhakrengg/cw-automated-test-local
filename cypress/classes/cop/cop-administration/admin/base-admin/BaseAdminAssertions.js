import EmailCommunity from '../../../../notification/email/EmailCommunity'
import EmailHelper from '../../../../utilities/EmailHelper'

export class BaseAdminAssertions {
  verifyApproveToJoinCopEmailTemplate(user, copName, isNonCwUser = false) {
    const linkName = isNonCwUser ? 'Proceed to Create Profile' : `Go to ${copName}'s Community`
    const firstName = user.firstName ? user.firstName : user.givenName
    const lastName = user.lastName ? user.lastName : user.familyName
    const emailHelper = new EmailHelper()
    const emailCommunity = new EmailCommunity(copName)
    const bannerImageUrl = '/documents/portlet_file_entry/'
    emailHelper
      .getReceivedEmail(emailCommunity.getApprovalEmailSubject(), user.email, true)
      .then(($receiveEmail) => {
        const emailTemplate = new DOMParser().parseFromString($receiveEmail, 'text/html')
        const emailHeader = emailTemplate.getElementsByTagName('table')[0].textContent
        expect(emailHeader).to.contains(emailCommunity.getApprovalEmailHeader())
        expect(emailHeader).to.contains(`Dear ${firstName} ${lastName},`)
        expect(emailHeader).to.contains(
          `Thank you for your interest in becoming part of ${copName}'s Community. ${copName} has approved your request.`
        )
        if (isNonCwUser) {
          expect(emailHeader).to.contains(`Please click the link below to create a short profile.`)
        }
        // expect($receiveEmail).to.contains(bannerImageUrl) Bug CW-17541
      })
      .getEmailElementHref(linkName)
    if (isNonCwUser) {
      cy.get('@elementHref').then(($url) => {
        cy.visit($url)
      })
    }
  }
  verifyRegistrationPage(copName, user, paymentType = 'Free') {
    cy.url().should('include', '/registration')
    cy.get('.registration-content-body').within(() => {
      cy.getElementWithLabel(`You are about to join ${copName}’s Community Site`, 'p.font-size-22')
      cy.getElementWithLabel(copName, '.wp-info')
      cy.get('input[name="_registration_firstName"]').should('have.value', user.firstName)
      cy.get('input[name="_registration_lastName"]').should('have.value', user.lastName)
      cy.get('input[name="_registration_emailAddress"]').should('have.value', user.email)
      cy.get('h4:contains("Free")')
        .parent('label')
        .within(($label) => {
          cy.wrap($label)
            .get('input[type="radio"]')
            .invoke('attr', 'value')
            .should('contain', 'member')
        })
    })
  }
}
