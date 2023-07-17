import Credentials from '../constants/Credentials'

class EnvLogin {
  static envPass = () => {
    const password = Credentials.getPassword()
    if (typeof password !== 'string' || !password) {
      throw new Error('Missing password value, set using CYPRESS_cw_pwd=...')
    }
    return password
  }
  static setEmail = (email) => {
    cy.get('#username').clear().type(email)
  }
  static getCsvEPath = (screenName) => {
    return Cypress.env('cw_ethereal_path') + screenName + '.csv'
  }
  static defaultRedirectUrl = (url) => {
    return url == '/' ? '/u/home/dashboard' : url
  }

  static disableException = () => {
    Cypress.on('uncaught:exception', () => false)
  }

  static disableLog = () => {
    this.turnOffLogByUrls([
      '/api/jsonws/invoke*',
      '/o/cw-push-notification/api/add?*',
      '/o/cw-translation-rest/api/translate',
      '/o/js_resolve_modules?modules=*',
      '/web/guest/messaging*',
      '/o/cw-cec-theme/*',
    ])
  }

  static turnOffLogByUrls = (urls = []) => {
    urls.forEach((data) => {
      cy.intercept({ url: data }, { log: false })
    })
  }
}

export default EnvLogin
