class YamlHelper {
  _prefix = 'cypress/fixtures/'
  _filePath
  _aliasJson
  _prefixJson
  constructor(pathUnderFixture) {
    this.setNewPath(pathUnderFixture)
    this._aliasJson = pathUnderFixture + 'Json'
    this._prefixJson = `@${this._aliasJson}`
  }

  read() {
    cy.readFile(this._filePath, { log: false }).then((dataString) =>
      cy.wrap(YAML.parse(dataString), { log: false }).as(this._aliasJson)
    )
    return cy.get(this._prefixJson)
  }
  setNewPath(pathUnderFixture) {
    this._filePath = this._prefix + pathUnderFixture + '.yaml'
  }
}

export default YamlHelper
