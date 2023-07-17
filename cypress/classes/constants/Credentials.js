import Environment from '../base/Environment'

class Credentials {
  static getPassword() {
    if (new Environment().isPrd()) {
      return Cypress.env('cw_prd_pwd')
    } else {
      return Cypress.env('cw_uat_pwd')
    }
  }
}

export default Credentials
