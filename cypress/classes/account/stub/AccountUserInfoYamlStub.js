import Environment from '../../base/Environment'
import YamlHelper from '../../utilities/YamlHelper'

class AccountUserInfoYamlStub {
  #allUsers
  #userInfo

  constructor() {
    new YamlHelper('users-orgmgt').read().then(({ Users }) => {
      this.#allUsers = Users[`${new Environment().getEnvYaml()}`]
    })
  }

  #setAUserInfo(baseYamlPath) {
    this.#userInfo = this.#allUsers[`${baseYamlPath}`]
  }

  getAuAcOrgAdminFullName() {
    this.#setAUserInfo('auAcOrgAdmin')
    return this.#userInfo.familyName + ' ' + this.#userInfo.givenName
  }

  getAuAcMemberFullName() {
    this.#setAUserInfo('auAcMember')
    return this.#userInfo.familyName + ' ' + this.#userInfo.givenName
  }
}

export default AccountUserInfoYamlStub
