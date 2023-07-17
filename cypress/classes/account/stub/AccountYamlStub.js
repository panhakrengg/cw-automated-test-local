import { OrgConst } from '../../org-management/base-org-management/OrgStub'
import YamlHelper from '../../utilities/YamlHelper'

class AccountYamlStub {
  #consentSuite
  #communitySuite
  #organizationSuite = OrgConst.NAME

  constructor() {
    this.accountBaseYaml = new YamlHelper('account').read().then((account) => {
      this.#consentSuite = account.Consents
      this.#communitySuite = account.Organizations.webLearn.communities
    })
  }

  getConsentName(consentBaseYaml) {
    return this.#consentSuite[`${consentBaseYaml}`].name
  }
  getCommunityName(communityBaseYaml) {
    return this.#communitySuite[`${communityBaseYaml}`].name
  }
  getOrganizationName() {
    return this.#organizationSuite
  }
}
export default AccountYamlStub
