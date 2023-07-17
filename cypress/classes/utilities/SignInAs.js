import UserRole from './user-role/UserRole'

class SignInAs {
  static member_Arielle(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_MEMBER.ARIELLE)
  }
  static exited_Hazle(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_MEMBER.EXIT_HAZLE)
  }
  static exitedOrgMemberSimo(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_MEMBER.EXIT_SIMO)
  }
  static cwUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.ALL_LOGIN)
  }
  static orgMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_MEMBER.NORMAL)
  }
  static helpGuideAdmin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.HELP_GUIDE_USERS.ADMIN)
  }
  static orgMemberDesignFrontend(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.DESIGN_FRONTEND.MEMBERS)
  }
  static orgMemberOrganizationConsent(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORGANIZATION_CONSENT_FORM.MEMBERS)
  }
  static coPOwnerDesignFrontend(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.DESIGN_FRONTEND.OWNERS)
  }
  static teamLeaderDesignFrontend(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.DESIGN_FRONTEND.TEAM_LEADERS)
  }
  static teamLeaderDrawFeaturePlan(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.DRAW_FEATURE_PLAN.TEAM_LEADERS)
  }
  static orgAdmin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_ADMIN.ORGANIZATION)
  }
  static orgAdmin_Amy(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_ADMIN.ORG_ADMIN_AMY)
  }
  static learningAdmin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_ADMIN.LEARNING)
  }
  static adminTwoOrg(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_ADMIN.TWO_ORGANIZATION)
  }
  static ciMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.INSTANCE_LMS_USERS.COURSE_INSTANCE)
  }
  static instanceMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.PROFILE_USERS.INSTANCE_MEMBER)
  }
  static aueEldredLegros(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.AU_EELDREDLEGROS)
  }
  static auFerry(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.AU_PLATFORM_FIRST_NAME_FERRY)
  }
  static teamLeaderRootOrgUnit(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ROOT_ORG_UNIT.TEAM_LEADERS)
  }
  static teamLeaderRootOrgUnitWi(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ROOT_ORG_UNIT.TEAM_LEADER_WI)
  }
  static rootOrgMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ROOT_ORG_UNIT.MEMBERS)
  }
  static demoFrontierAdmin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.DEMO_FRONTIER_USERS.ADMIN)
  }
  static freemiumUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.FREEMIUM)
  }
  static freemiumFuncUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.FREEMIUM_FUNC)
  }
  static cwNormalUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.NORMAL_USER)
  }
  static courseInstanceMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.INSTANCE_LMS_USERS.COURSE_INSTANCE)
  }
  static learningAdminEmery(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY)
  }
  static learningPathF(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEARNING_PATH_ADMIN.AU_LEARNING_PATH_F)
  }
  static categoryAdminKenton(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON)
  }
  static courseAdminTressie(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_AD_TRESSIE)
  }
  static courseAdminGiles(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_LEAD_GILES)
  }
  static courseFaciMaverick(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_LEAD_FACI_MAVERICK)
  }
  static instanceFaciBritney(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.INSTANCE_ADMIN.AU_LN_IST_FACI_BRITNEY)
  }
  static instanceFaciAmina(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.INSTANCE_ADMIN.AU_LN_IST_LEAD_FACI_AMINA)
  }
  static categoryMemberQuentin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_CTG_MEM_QUESTIN)
  }
  static learnerMallory(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_MALLORY)
  }
  static learnerDelphia(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_DELPHIA)
  }
  static learnerLitzy(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_COU_MEM_LITZY)
  }
  static learnerKulas(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LEARNER_ONLYME_KULAS)
  }
  static learnerChangeEmailJen(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LEARNER_Change_Email_JEN)
  }
  static reSignInAsExited_Hazle(redirectUrl = '/') {
    cy.signOut()
    this.exited_Hazle(redirectUrl)
  }
  static reSignInAsLearningAdmin(redirectUrl = '/') {
    cy.signOut()
    this.learningAdmin(redirectUrl)
  }
  static copOwner(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPUsers.OWNER)
  }
  static copAdmin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPUsers.ADMIN)
  }
  static copAdminSecond(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPUsers.ADMIN, 1, 1)
  }
  static copContactManager(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPUsers.CONTACT_MANAGER)
  }
  static copMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPUsers.MEMBER)
  }
  static memberInstruction(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.INSTRUCTION_SESSION.MEMBERS)
  }
  static switchLangUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.SWITCH_LANG_USER)
  }
  static passwordChangeUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.PASSWORD_CHANGE_USER)
  }
  static backupCodeUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.BACKUP_CODE_USER)
  }
  static otpCodeUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.OTP_CODE_USER)
  }
  static getOtpCodeUser(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.GET_OTP_CODE_USER)
  }
  static aueOfflineMsg(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.WHITE_LABEL.AUE_OFFLINE_MSG)
  }
  static nonOrgMember_Virgie(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.NON_ORG_MEMBER.VIRGIE)
  }
  static auPfSwitchCoP(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.ORG_MEMBER.AU_PF_SWITCH_COP)
  }
  static myConnection_Jamison(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.MY_CONNECTION_JAMISON)
  }
  static copOwner_Phoebe(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.OWNER_PHOEBE)
  }
  static copOwner_Kristy(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.OWNER_KRISTY)
  }
  static copAdmin_Bettye(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.ADMIN_BETTYE)
  }
  static copAdmin_Kendal(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.ADMIN_KENDAL)
  }
  static copMember_Enola(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.MEMBER_ENOLA)
  }
  static copContactManager_Murl(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.CONTACT_MANAGER_MURL)
  }
  static reSignInAsMemberInstruction(redirectUrl = '/') {
    cy.signOut()
    this.memberInstruction(redirectUrl)
  }
  static reSignInAsCwUser(redirectUrl = '/') {
    cy.signOut()
    this.cwUser(redirectUrl)
  }
  static reSignInAsCwNormalUser(redirectUrl = '/') {
    cy.signOut()
    this.cwNormalUser(redirectUrl)
  }
  static reSignInAsOrgMember(redirectUrl = '/') {
    cy.signOut()
    this.orgMember(redirectUrl)
  }
  static reSignInAsHelpGuideAdmin(redirectUrl = '/') {
    cy.signOut()
    this.helpGuideAdmin(redirectUrl)
  }
  static reSignInAsOrgAdmin(redirectUrl = '/') {
    cy.signOut()
    this.orgAdmin(redirectUrl)
  }
  static reSignInAsAdminTwoOrg(redirectUrl = '/') {
    cy.signOut()
    this.adminTwoOrg(redirectUrl)
  }
  static reSignInAsTeamLeader(redirectUrl = '/') {
    cy.signOut()
    this.teamLeaderRootOrgUnit(redirectUrl)
  }
  static reSignInAsDemoFrontierAdmin(redirectUrl = '/') {
    cy.signOut()
    this.demoFrontierAdmin(redirectUrl)
  }
  static reSignInOrgMemberOrganizationConsent(redirectUrl = '/') {
    cy.signOut()
    this.orgMemberOrganizationConsent(redirectUrl)
  }
  static reSignInOrgMemberDesignFrontend(redirectUrl = '/') {
    cy.signOut()
    this.orgMemberDesignFrontend(redirectUrl)
  }
  static reSignInCoPOwnerDesignFrontend(redirectUrl = '/') {
    cy.signOut()
    this.coPOwnerDesignFrontend(redirectUrl)
  }
  static reSignInAsRootOrgMember(redirectUrl = '/') {
    cy.signOut()
    this.rootOrgMember(redirectUrl)
  }
  static auFireCloudReplace1(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.AU_FIRE_CLOUD_REPLACE_1)
  }
  static myConnection_Amanda(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CW_USERS.MY_CONNECTION_AMANDA)
  }
  static reSignInAsCopAdminSecond(redirect = '/') {
    cy.signOut()
    this.copAdminSecond(redirect)
  }
  static reSignInAsCopMember(redirectUrl = '/') {
    cy.signOut()
    this.copMember(redirectUrl)
  }
  static reSignInAsCopAdmin(redirectUrl = '/') {
    cy.signOut()
    this.copAdmin(redirectUrl)
  }
  static reSignInAsCopContactManager(redirectUrl = '/') {
    cy.signOut()
    this.copContactManager(redirectUrl)
  }
}

export default SignInAs
