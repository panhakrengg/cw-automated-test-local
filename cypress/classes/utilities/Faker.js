import Environment from '../base/Environment'
class Faker {
  _path
  _environment = new Environment()

  constructor(path) {
    this._path = path
  }
  setPathFixture(path) {
    this._path = path
  }
  getAuTextNotDelete(text) {
    return this._environment.isPrd() ? `${text}` : `${text} (Automation Do not Delete)`
  }
  getAuText(text) {
    return `AU ${text}`
  }
  getFixtureUrlId(index, alias) {
    cy.wrap(this.getUrlId(index)).as(alias)
  }
  getFixtureValue(alias, index) {
    cy.wrap(index ? this._path[index] : this._path).as(alias)
  }
  getUrlId(index = 0) {
    if (this._environment.isLocal() && this._path.url.local)
      return this._path.url.local.id[`${index}`]
    else if (this._environment.isPrd()) return this._path.url.prd.id[`${index}`]
    else
      return this._environment.isUat() || this._environment.isLocal()
        ? this._path.url.uat.id[`${index}`]
        : this._path.url.beta.id[`${index}`]
  }
  getEntryFixture() {
    if (this._environment.isPrd()) return this._path.prd
    else if (this._environment.isUat()) return this._path.uat
    else if (this._environment.isBeta()) return this._path.beta
    else return this._path.local
  }
  randomName(name) {
    const timestamp = Date.now()
    return `${name} ${timestamp}`
  }
}

export default Faker
