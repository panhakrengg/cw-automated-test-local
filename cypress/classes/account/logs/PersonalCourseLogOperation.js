import { recurse } from 'cypress-recurse'

class PersonalCourseLogOperation {
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
  findingLog(logText) {
    console.log(`Find log: ` + logText)
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => {
        $allLogs.text().includes(logText)
      },
      this.configOption
    )
  }
}

export default PersonalCourseLogOperation
