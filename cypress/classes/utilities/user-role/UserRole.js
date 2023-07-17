import LmsUserRole from './LmsUserRole'

class UserRole extends LmsUserRole {
  static #ORG_MGT_USERS = 'OrgMgtUsers'
  static #ORG_MANAGEMENT = `${this.#ORG_MGT_USERS}.orgMgt`
  static #ORG_UNIT = `${this.#ORG_MANAGEMENT}.orgUnit`
  static #BASE = {
    COP_USERS: 'CoPUsers',
    COP_ADMINISTRATION_USERS: 'CoPAdministrationUsers',
    CW_USERS: 'CWUsers',
    DEMO_FRONTIER_USERS: 'DemoFrontierUsers.orgMgt.members',
    DESIGN_FRONTEND: `${this.#ORG_UNIT}.designFrontend`,
    DRAW_FEATURE_PLAN: `${this.#ORG_UNIT}.drawFeaturePlan`,
    HELP_GUIDE_USERS: 'HelpGuideUsers',
    INSTANCE_LMS_USERS: 'InstanceLMSUsers.demo.learners',
    INSTRUCTION_SESSION: `${this.#ORG_UNIT}.instructionSession`,
    ORG_ADMIN: `${this.#ORG_MANAGEMENT}.admins`,
    ORG_MEMBER: `${this.#ORG_MANAGEMENT}.members`,
    NON_ORG_MEMBER: `${this.#ORG_MANAGEMENT}.nonMembers`,
    ORGANIZATION_CONSENT_FORM: `${this.#ORG_UNIT}.organizationConsentForm`,
    ROOT_ORG_UNIT: `${this.#ORG_UNIT}.rootOrg`,
    ORG_LMS: `OrgLmsUsers`,
  }
  static ROOT_ORG_UNIT = {
    TEAM_LEADERS: `${this.#BASE.ROOT_ORG_UNIT}.teamLeaders`,
    TEAM_LEADER_WI: `${this.#BASE.ROOT_ORG_UNIT}.teamLeaderWi`,
    MEMBERS: `${this.#BASE.ROOT_ORG_UNIT}.members`,
    LOCK: `${this.#BASE.ROOT_ORG_UNIT}.lock`,
    TWO_FA_ROOT_ORG: `${this.#BASE.ROOT_ORG_UNIT}.twoFaRootOrg`,
  }
  static CW_USERS = {
    ALL_LOGIN: `${this.#BASE.CW_USERS}.allLogin`,
    AU_FIRE_CLOUD_REPLACE_1: `${this.#BASE.CW_USERS}.auFireCloudReplace1`,
    FREEMIUM: `${this.#BASE.CW_USERS}.freemium`,
    FREEMIUM_FUNC: `${this.#BASE.CW_USERS}.freemiumFunc`,
    NORMAL_USER: `${this.#BASE.CW_USERS}.normalUser`,
    SWITCH_LANG_USER: `${this.#BASE.CW_USERS}.switchLangUser`,
    PASSWORD_CHANGE_USER: `${this.#BASE.CW_USERS}.passwordChangeUser`,
    BACKUP_CODE_USER: `${this.#BASE.CW_USERS}.backupCodeUser`,
    OTP_CODE_USER: `${this.#BASE.CW_USERS}.otpCodeUser`,
    GET_OTP_CODE_USER: `${this.#BASE.CW_USERS}.getOtpCodeUser`,
    AU_EELDREDLEGROS: `${this.#BASE.CW_USERS}.aueEldredLegros`,
    AUE_JASONFUNK: `${this.#BASE.CW_USERS}.aueJasonFunk`,
    AU_DEON_BOGISICH: `${this.#BASE.CW_USERS}.auDeonBogisich`,
    AU_MOZELL_LUETTGEN: `${this.#BASE.CW_USERS}.auMozellLuettgen`,
    MY_CONNECTION_JAMISON: `${this.#BASE.CW_USERS}.myConnection_Jamison`,
    MY_CONNECTION_AMANDA: `${this.#BASE.CW_USERS}.myConnection_Amanda`,
    AU_PLATFORM_FIRST_NAME_FERRY: `${this.#BASE.CW_USERS}.auPlatformFirstName_Ferry`,
  }
  static CoPUsers = {
    OWNER: `${this.#BASE.COP_USERS}.owner`,
    ADMIN: `${this.#BASE.COP_USERS}.admin`,
    CONTACT_MANAGER: `${this.#BASE.COP_USERS}.contactManager`,
    MEMBER: `${this.#BASE.COP_USERS}.member`,
  }
  static CoPAdministrationUser = {
    OWNER_KRISTY: `${this.#BASE.COP_ADMINISTRATION_USERS}.owners.kristy`,
    OWNER_PHOEBE: `${this.#BASE.COP_ADMINISTRATION_USERS}.owners.phoebe`,
    ADMIN_KENDAL: `${this.#BASE.COP_ADMINISTRATION_USERS}.admins.kendal`,
    ADMIN_BETTYE: `${this.#BASE.COP_ADMINISTRATION_USERS}.admins.bettye`,
    MEMBER_ENOLA: `${this.#BASE.COP_ADMINISTRATION_USERS}.members.enola`,
    CONTACT_MANAGER_MURL: `${this.#BASE.COP_ADMINISTRATION_USERS}.contactManagers.murl`,
  }
  static ORG_MEMBER = {
    ARIELLE: `${this.#BASE.ORG_MEMBER}.arielle`,
    EXIT_HAZLE: `${this.#BASE.ORG_MEMBER}.orgExited_Hazle`,
    EXIT_SIMO: `${this.#BASE.ORG_MEMBER}.orgExited_Simo`,
    NORMAL: `${this.#BASE.ORG_MEMBER}.normal`,
    RESET_PWD: `${this.#BASE.ORG_MEMBER}.resetPwd`,
    LOCK_USER: `${this.#BASE.ORG_MEMBER}.lockUser`,
    VIEW_ORG_PROFILE: `${this.#BASE.ORG_MEMBER}.viewOrgProfile`,
    REMOVE_USER: `${this.#BASE.ORG_MEMBER}.removeUser`,
    REMOVE_FREE_USER: `${this.#BASE.ORG_MEMBER}.removeFreeUser`,
    AU_2FA_ACTIVITY_LOG: `${this.#BASE.ORG_MEMBER}.au2FaActivityLog`,
    AU_PF_SWITCH_COP: `${this.#BASE.ORG_MEMBER}.auPfSwitchCoP`,
    EXITED: `${this.#BASE.ORG_MEMBER}.exited`,
    ENABLED_TWO_FA: `${this.#BASE.ORG_MEMBER}.enabledTwoFa`,
  }
  static NON_ORG_MEMBER = {
    VIRGIE: `${this.#BASE.NON_ORG_MEMBER}.virgie`,
  }
  static ORG_ADMIN = {
    LEARNING: `${this.#BASE.ORG_ADMIN}.learning`,
    TWO_ORGANIZATION: `${this.#BASE.ORG_ADMIN}.twoOrganization`,
    ORGANIZATION: `${this.#BASE.ORG_ADMIN}.organization`,
    ORG_ADMIN_AMY: `${this.#BASE.ORG_ADMIN}.orgAdmin_Amy`,
  }
  static DESIGN_FRONTEND = {
    MEMBERS: `${this.#BASE.DESIGN_FRONTEND}.members`,
    OWNERS: `${this.#BASE.DESIGN_FRONTEND}.copOwners`,
    TEAM_LEADERS: `${this.#BASE.DESIGN_FRONTEND}.teamLeaders`,
  }
  static DRAW_FEATURE_PLAN = {
    TEAM_LEADERS: `${this.#BASE.DRAW_FEATURE_PLAN}.teamLeaders`,
    LOCK: `${this.#BASE.DRAW_FEATURE_PLAN}.lock`,
    TWO_FA_SMOKE: `${this.#BASE.DRAW_FEATURE_PLAN}.twoFaSmoke`,
    TWO_FA_PLAN: `${this.#BASE.DRAW_FEATURE_PLAN}.twoFaPlan`,
    RESET_PWD: `${this.#BASE.DRAW_FEATURE_PLAN}.resetPwd`,
  }
  static HELP_GUIDE_USERS = {
    ADMIN: `${this.#BASE.HELP_GUIDE_USERS}.admin`,
  }
  static INSTRUCTION_SESSION = {
    MEMBERS: `${this.#BASE.INSTRUCTION_SESSION}.members`,
  }
  static ORGANIZATION_CONSENT_FORM = {
    MEMBERS: `${this.#BASE.ORGANIZATION_CONSENT_FORM}.members`,
  }
  static INSTANCE_LMS_USERS = {
    COURSE_INSTANCE: `${this.#BASE.INSTANCE_LMS_USERS}.courseInstance`,
  }
  static DEMO_FRONTIER_USERS = {
    ADMIN: `${this.#BASE.DEMO_FRONTIER_USERS}.demoFrontierAdmin`,
  }
  static PROFILE_USERS = {
    INSTANCE_MEMBER: 'ProfileUsers.normalUser.instanceMember',
  }
  static ACTIVITY_LOG = {
    AU_AC_FUNC_MEMBER: 'ActivityLog.auAcFuncMember',
    AU_AC_MEMBER: 'ActivityLog.auAcMember',
    AU_AC_ORG_ADMIN: 'ActivityLog.auAcOrgAdmin',
    AU_MARLENEREMPEL: 'ActivityLog.auMarleneRempel',
    AU_LOG_JOIN_COP: 'ActivityLog.auLogJoinCop',
    AU_LOG_ACCEPT_COP: 'ActivityLog.auLogAcceptCop',
  }
  static WHITE_LABEL = {
    AU_ESANTOS: 'WhiteLabel.org.fireCloud.members.auESantos',
    AUE_OFFLINE_MSG: 'WhiteLabel.org.fireCloud.members.auEOfflineMsg',
  }
  static PERSONAL_MANAGEMENT = {
    ADMINS: `${this.#ORG_MGT_USERS}.personalManagement.admins`,
  }

  static LEARNER_USERS = {
    AU_OPT_OUT_CA: `${this.#BASE.ORG_LMS}.learners.auOptOutCa`,
  }
}

export default UserRole
