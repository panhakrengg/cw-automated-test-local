class InterceptAction {
  _prefix = 'itc'
  _alias
  _path
  constructor(name, alias) {
    this._alias = this._prefix + alias
    this._path = `**javax.portlet.action=${encodeURIComponent(name)}`
  }
  set() {
    cy.intercept(this._path).as(this._alias)
  }
  wait() {
    const itcName = `@` + this._alias
    cy.wait(itcName).its('response.statusCode').should('eq', 200)
    return cy.get(itcName).its('state').should('eq', 'Complete')
  }
}

export default InterceptAction
