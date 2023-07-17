import Environment from '../../../../base/Environment'
import EntryYamlManagement from '../../../../utilities/EntryYamlManagement'
import LmsUserRole from '../../../../utilities/user-role/LmsUserRole'
import UserRole from '../../../../utilities/user-role/UserRole'

export default class CopManageMembersYaml {
  env = new Environment()
  #copManageMembersFilePath = 'cop-administration/manage-members/cop-manage-members'
  #mwCoPInvite = 'InviteMembers.mwCoPInvite'
  #tPCoPInvite = 'InviteMembers.tPCoPInvite'
  #oCoPInvite = 'InviteMembers.oCoPInvite'
  #tCoPInvite = 'InviteMembers.tCoPInvite'
  #mwCoPReminder = 'SendReminder.mwCoPReminder'
  #oCoPReminder = 'SendReminder.oCoPReminder'

  #readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#copManageMembersFilePath, entryPath, callback)
  }

  #getUserInfo(userEntryPath, callback) {
    cy.stubUser(userEntryPath)
    cy.get('@stubUser').then((user) => {
      callback(user)
    })
  }

  /*============================= User ==================================*/

  getUserInfoAmanda(callback) {
    this.#getUserInfo('CWUsers.myConnection_Amanda', callback)
  }

  getUserInfoJamison(callback) {
    this.#getUserInfo('CWUsers.myConnection_Jamison', callback)
  }

  getUserInfoArielle(callback) {
    this.#getUserInfo('OrgMgtUsers.orgMgt.members.arielle', callback)
  }

  getUserInfoCwNormalUser(callback) {
    this.#getUserInfo('CWUsers.normalUser', callback)
  }

  getUserInfoOrgUserGiles(callback) {
    this.#getUserInfo(UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_LEAD_GILES, callback)
  }

  getUserInfoOrgUserHazle(callback) {
    this.#getUserInfo(UserRole.ORG_MEMBER.EXIT_HAZLE, callback)
  }

  getUserInfoOrgUserLitzy(callback) {
    this.#getUserInfo(UserRole.LMS_USERS.LEANER.AU_LN_COU_MEM_LITZY, callback)
  }

  getUserInfoOrgUserTressie(callback) {
    this.#getUserInfo(LmsUserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_AD_TRESSIE, callback)
  }

  getUserInfoOrgUserJoanie(callback) {
    this.#getUserInfo(LmsUserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_FACI_JOANIE, callback)
  }

  getUserInfoOrgUserEmery(callback) {
    this.#getUserInfo(LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY, callback)
  }

  getUserInfoOrgUserFrances(callback) {
    this.#getUserInfo(LmsUserRole.LMS_USERS.INSTANCE_ADMIN.AU_LN_IST_AD_FRANCES, callback)
  }

  getUserInfoOrgUserEnola(callback) {
    this.#getUserInfo(UserRole.CoPAdministrationUser.MEMBER_ENOLA, callback)
  }

  getUserInfoOrgUserMurl(callback) {
    this.#getUserInfo(UserRole.CoPAdministrationUser.CONTACT_MANAGER_MURL, callback)
  }

  /*============================= Community ==================================*/

  getMwCoPInvite(callback) {
    return this.#readYamlData(this.#mwCoPInvite, callback)
  }

  getTPCoPInvite(callback) {
    return this.#readYamlData(this.#tPCoPInvite, callback)
  }

  getOCoPInvite(callback) {
    return this.#readYamlData(this.#oCoPInvite, callback)
  }

  getTCoPInvite(callback) {
    return this.#readYamlData(this.#tCoPInvite, callback)
  }

  getMwCoPReminder(callback) {
    return this.#readYamlData(this.#mwCoPReminder, callback)
  }

  getOCoPReminder(callback) {
    return this.#readYamlData(this.#oCoPReminder, callback)
  }
}
