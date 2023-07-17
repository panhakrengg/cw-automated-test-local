import UserRole from '../../../utilities/user-role/UserRole'
class SignInAsCoP {
  owner_Kristy(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.OWNER_KRISTY)
  }

  owner_Phoebe(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.OWNER_PHOEBE)
  }

  admin_Bettye(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.ADMIN_BETTYE)
  }

  admin_Kendal(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.ADMIN_KENDAL)
  }

  member_Enola(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.MEMBER_ENOLA)
  }

  contactManager_Murl(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, UserRole.CoPAdministrationUser.CONTACT_MANAGER_MURL)
  }
}
export default SignInAsCoP
