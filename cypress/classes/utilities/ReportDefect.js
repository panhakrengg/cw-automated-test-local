import Environment from '../base/Environment'

class ReportDefect {
  static markCwDefect(msg) {
    const report = Cypress.Allure.reporter
    report.runningTest.info.status = 'unknown'
    if (msg) {
      report.runningTest.info.description = msg
    }
  }

  static markAsPrdCwDefect(msg) {
    const env = new Environment()
    if (env.isPrd()) this.markCwDefect(msg)
  }
  static markAsUATCwDefect(msg) {
    const env = new Environment()
    if (env.isUat()) this.markCwDefect(msg)
  }
  static markAsBETACwDefect(msg) {
    const env = new Environment()
    if (env.isBeta()) this.markCwDefect(msg)
  }
  static markAsLocalCwDefect(msg) {
    const env = new Environment()
    if (env.isLocal()) this.markCwDefect(msg)
  }
}

export default ReportDefect
