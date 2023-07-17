class Environment {
  _host
  _baseUrl
  _prd = 'prd'
  _uat = 'uat'
  _beta = 'beta'
  _local = 'local'

  constructor() {
    this._host = Cypress.env('host')
    this._baseUrl = Cypress.config('baseUrl')
  }

  isPrd() {
    return this._baseUrl == this._host[this._prd]
  }

  isUat() {
    return this._baseUrl == this._host[this._uat]
  }

  isBeta() {
    return this._baseUrl == this._host[this._beta]
  }

  isLocal() {
    return this._baseUrl == this._host[this._local]
  }

  getEnvPrefix() {
    if (this.isBeta()) return this._beta
    else if (this.isUat()) return this._uat
    else if (this.isLocal()) return this._local
    else return this.isPrd() ? this._prd : ''
  }

  getEnvPrefixCombination() {
    const envPrefix = this.getEnvPrefix()
    return this.isPrd() ? envPrefix : `${envPrefix}-`
  }

  getEnvYaml() {
    return this.getEnvPrefix() === `${this._prd}` ? this._prd : this._uat
  }

  performAction(uatCallback = () => {}, prdCallback = () => {}) {
    if (this.isPrd()) {
      return prdCallback()
    } else {
      return uatCallback()
    }
  }
}

export default Environment
