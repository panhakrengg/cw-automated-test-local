import UserRole from '../../utilities/user-role/UserRole'

class AccountUserStub {
  static signInAsAuAcFunc(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ORG_ADMIN.ORGANIZATION, 2, 2)
  }
  static signInAsAuAcFuncMember(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ACTIVITY_LOG.AU_AC_FUNC_MEMBER)
  }
  static signInAsAuMarleneRempel(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ACTIVITY_LOG.AU_MARLENEREMPEL)
  }
  static signInAsAuAcMember(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ACTIVITY_LOG.AU_AC_MEMBER)
  }
  static signInAsAuLogJoinCop(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ACTIVITY_LOG.AU_LOG_JOIN_COP)
  }
  static signInAsAuLogAcceptCop(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ACTIVITY_LOG.AU_LOG_ACCEPT_COP)
  }
  static signInAsAuAcOrgAdmin(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ORG_ADMIN.ORGANIZATION, 1, 1)
  }
  static signInAsAu2FaActivityLogMember(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.ORG_MEMBER.AU_2FA_ACTIVITY_LOG)
  }
  static signInAsAuESantos(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.WHITE_LABEL.AU_ESANTOS)
  }
  static signInAsJsonFunk(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.CW_USERS.AUE_JASONFUNK)
  }
  static signInAsDeonBogisich(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.CW_USERS.AU_DEON_BOGISICH)
  }
  static signInAsAuMozellLuettgen(redirect = '/') {
    cy.visitThenSignIn(redirect, UserRole.CW_USERS.AU_MOZELL_LUETTGEN)
  }
}

export default AccountUserStub
