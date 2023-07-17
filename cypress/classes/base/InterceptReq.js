class InterceptReq {
  _prefix = 'itc'
  _name
  _alias
  _path
  constructor(name, alias) {
    this._name = name
    this._alias = this._prefix + alias
    this._path = `**p_p_resource_id=${encodeURIComponent(this._name)}`
  }
  set() {
    cy.intercept(this._path).as(this._alias)
  }
  wait() {
    cy.wait(this.getSubject()).its('response.statusCode', { log: false }).should('eq', 200)
    cy.get(this.getSubject()).its('state', { log: false }).should('eq', 'Complete')
  }
  getSubject() {
    return `@` + this._alias
  }
  getResponse() {
    return cy.get(this.getSubject())
  }
}

export default InterceptReq
