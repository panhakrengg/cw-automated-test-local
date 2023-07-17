import YamlHelper from '../../../utilities/YamlHelper'

class QueryCoPUserInfo {
  #user

  constructor() {
    this.userYaml = new YamlHelper('users-orgmgt')
  }

  setCoPUser() {
    this.userYaml.read().then(({ CoPAdministrationUsers }) => {
      this.setCoPUserObject(CoPAdministrationUsers)
    })
  }

  setCoPUserObject(user) {
    this.#user = user
  }

  setRoleYamlPath(role, name) {
    return this.#user[role][name].users.uat
  }

  getFullName(role, name) {
    return (
      this.setRoleYamlPath(role, name).givenNames[0] +
      ' ' +
      this.setRoleYamlPath(role, name).familyNames[0]
    )
  }

  getScreenName(role, name) {
    return this.setRoleYamlPath(role, name).screenNames[0]
  }

  getEmail(role, name) {
    return this.setRoleYamlPath(role, name).emails[0]
  }

  /* START ******** Get User Full Names For CoP Administration ********/
  _ownerKristyFullName() {
    return this.getFullName('owners', 'kristy')
  }
  _adminKendalFullName() {
    return this.getFullName('admins', 'kendal')
  }
  _memberEnolaFullName() {
    return this.getFullName('members', 'enola')
  }
  _contactManagerMurlFullName() {
    return this.getFullName('contactManagers', 'murl')
  }
  /* END ******** Get Full Names For CoP Administration ********/

  /* START ******** Get User Screen Names For CoP Administration ********/
  _ownerKristyScreenName() {
    return this.getScreenName('owners', 'kristy')
  }
  _adminKendalScreenName() {
    return this.getScreenName('admins', 'kendal')
  }
  _memberEnolaScreenName() {
    return this.getScreenName('members', 'enola')
  }
  _contactManagerMurlScreenName() {
    return this.getScreenName('contactManagers', 'murl')
  }
  /* END ******** Get Screen Names For CoP Administration ********/

  /* START ******** Get User Emails For CoP Administration ********/
  _ownerKristyEmail() {
    return this.getEmail('owners', 'kristy')
  }
  _adminKendalEmail() {
    return this.getEmail('admins', 'kendal')
  }
  _memberEnolaEmail() {
    return this.getEmail('members', 'enola')
  }
  _contactManagerMurlEmail() {
    return this.getEmail('contactManagers', 'murl')
  }
  /* END ******** Get User Emails For CoP Administration ********/
}
export default QueryCoPUserInfo
