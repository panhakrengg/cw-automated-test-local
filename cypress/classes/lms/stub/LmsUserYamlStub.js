import Environment from '../../base/Environment'
import YamlHelper from '../../utilities/YamlHelper'

class LmsUserYamlStub {
  #adminBaseYaml
  #learnerBaseYaml
  #env = new Environment().getEnvYaml()

  setData() {
    new YamlHelper('users-orgmgt').read().then(({ OrgLmsUsers }) => {
      this.#adminBaseYaml = OrgLmsUsers.admins
      this.#learnerBaseYaml = OrgLmsUsers.learners
    })
  }

  //*************** Get Course Admin Emails ***************//
  #getCourseAdminEmailBy(userBaseYaml) {
    return this.#adminBaseYaml.courses[`${userBaseYaml}`].users[`${this.#env}`].emails[0]
  }
  getCouAdminEmail_Tressie() {
    return this.#getCourseAdminEmailBy('auLnCouAd_Tressie')
  }
  getCouLeadEmail_Giles() {
    return this.#getCourseAdminEmailBy('auLnCouLead_Giles')
  }
  getCouLeadFaciEmail_Maverick() {
    return this.#getCourseAdminEmailBy('auLnCouLeadFaci_Maverick')
  }
  getCouFaciEmail_Joanie() {
    return this.#getCourseAdminEmailBy('auLnCouFaci_Joanie')
  }
}
export default LmsUserYamlStub
