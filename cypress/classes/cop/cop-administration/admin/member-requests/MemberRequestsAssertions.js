export class MemberRequestsAssertions {
  verifyMemberNotExistInTableWith(email) {
    cy.cwTable().then(($cwTable) => {
      cy.wrap($cwTable).find(`tbody tr td:contains("${email}")`).should('not.exist')
    })
  }
}
