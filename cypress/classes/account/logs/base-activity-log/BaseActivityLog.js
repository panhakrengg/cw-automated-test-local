class BaseActivityLog {
  configOption = {
    post() {
      cy.scrollTo('bottom')
    },
    limit: 100,
    timeout: 100000,
  }
  elBodyLogs() {
    return cy.get('.cec-card__body:visible').eq(1).should(Cypress._.noop)
  }
}

export default BaseActivityLog
