import Environment from '../base/Environment'

const environment = new Environment()

class UserFixture {
  _emailIndex
  _allUsers
  _users

  constructor(role, users, others) {
    this._allUsers = Object.assign(users, others)
    let userRoleArray = role.split('.')
    let user = this._allUsers
    userRoleArray.forEach((element) => {
      user = user[element]
    })
    this._users = user.users[environment.getEnvYaml()]
  }

  getEmail(emailIndex = 0) {
    return this._users.emails[emailIndex]
  }

  getScreenName(screenNameIndex = 0) {
    return this._users.screenNames[screenNameIndex]
  }

  getGivenName(givenNameIndex = 0) {
    let givenName = ''
    if (this._users.givenNames) {
      givenName = this._users.givenNames[givenNameIndex]
    }
    return givenName
  }

  getFamilyName(familyNameIndex = 0) {
    let familyName = ''
    if (this._users.familyNames) {
      familyName = this._users.familyNames[familyNameIndex]
    }
    return familyName
  }

  getFullName(givenNameIndex = 0, familyNameIndex = 0, fullNameIndex = 0) {
    let fullName = this.getGivenName(givenNameIndex) + ' ' + this.getFamilyName(familyNameIndex)
    return fullName.trim().length
      ? fullName
      : this._users.fullNames
      ? this._users.fullNames[fullNameIndex]
      : ''
  }

  getProfile(profileIndex = 0) {
    let profile = ''
    if (this._users.profiles) {
      profile = this._users.profiles[profileIndex]
    }
    return profile
  }

  getSecondEmail(secondEmailIndex = 0) {
    let secondEmail = ''
    if (this._users.secondEmails) {
      secondEmail = this._users.secondEmails[secondEmailIndex]
    }
    return secondEmail
  }

  buildUserObjByIndex(emailIndex, screenNameIndex, givenNameIndex, familyNameIndex) {
    return {
      email: this.getEmail(emailIndex),
      screenName: this.getScreenName(screenNameIndex),
      givenName: this.getGivenName(givenNameIndex),
      familyName: this.getFamilyName(familyNameIndex),
      fullName: this.getFullName(givenNameIndex, familyNameIndex),
      profile: this.getProfile(emailIndex),
      secondEmail: this.getSecondEmail(emailIndex),
    }
  }
}

export default UserFixture
