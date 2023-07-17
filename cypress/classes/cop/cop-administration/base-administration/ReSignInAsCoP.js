import SignInAsCoP from "./SignInAsCoP"

class ReSignInAsCoP extends SignInAsCoP{
  rOwner_Kristy(redirectUrl = '/') {
    this.owner_Kristy(redirectUrl)
  }

  rAdmin_Kendal(redirectUrl = '/') {
    this.admin_Kendal(redirectUrl)
  }

  rMember_Enola(redirectUrl = '/') {
    this.member_Enola(redirectUrl)
  }

  rContactManager_Murl(redirectUrl = '/') {
    this.contactManager_Murl(redirectUrl)
  }
}
export default ReSignInAsCoP