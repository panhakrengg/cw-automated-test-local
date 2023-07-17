import UserRole from '../user-role/UserRole'

class SignInLmsAs {
  istMember_Mallory(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_MALLORY)
  }
  istMember_Delphia(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_DELPHIA)
  }
  ctgMember_FuncMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_FUNC_MEMBERS)
  }
  ctgMember_Quentin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_CTG_MEM_QUESTIN)
  }
  couMember_Litzy(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_LN_COU_MEM_LITZY)
  }
  couMember_auOptOutMember(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_OPT_OUT_MEMBER)
  }
  couMember_auOptOutCa(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_OPT_OUT_CA)
  }
  couMember_auOptOutLearner(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEANER.AU_OPT_OUT_LEANER)
  }
  couAdmin_Tressie(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_AD_TRESSIE)
  }
  couFaci_Joanie(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_FACI_JOANIE)
  }
  couLead_Func(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_AC_FUNC)
  }
  couLead_Giles(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_LEAD_GILES)
  }
  couLeadFaci_Maverick(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_LEAD_FACI_MAVERICK)
  }
  ctgAdmin_Kenton(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON)
  }
  istAdmin_Frances(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.INSTANCE_ADMIN.AU_LN_IST_AD_FRANCES)
  }
  istFaci_Britney(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.INSTANCE_ADMIN.AU_LN_IST_FACI_BRITNEY)
  }
  istLeadFaci_Amina(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.INSTANCE_ADMIN.AU_LN_IST_LEAD_FACI_AMINA)
  }
  learningAdmin(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEARNING_ADMIN.LEARN_MGT_ADMIN)
  }
  lnAdmin_Emery(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY)
  }
  lnAdmin_auOptOutOwner(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEARNING_ADMIN.AU_OPT_OUT_OWNER)
  }
  lnAdmin_Cw(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.LEARNING_ADMIN.LEARN_CW_ADMIN)
  }
  lnPathAdmin_Emery(redirectUrl = '/') {
    this.lnAdmin_Emery(redirectUrl)
  }
  couLead_AueTanya(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.LMS_USERS.COURSE_LEADER.AU_ETANYA)
  }
}
export default SignInLmsAs
