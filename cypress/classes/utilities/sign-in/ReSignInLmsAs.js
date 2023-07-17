import SignInLmsAs from './SignInLmsAs'

class ReSignInLmsAs extends SignInLmsAs {
  rIstMember_Mallory(redirectUrl = '/') {
    cy.signOut()
    this.istMember_Mallory(redirectUrl)
  }
  rIstMember_Delphia(redirectUrl = '/') {
    cy.signOut()
    this.istMember_Delphia(redirectUrl)
  }
  rCtgMember_FuncMember(redirectUrl = '/') {
    cy.signOut()
    this.ctgMember_FuncMember(redirectUrl)
  }
  rCtgMember_Quentin(redirectUrl = '/') {
    cy.signOut()
    this.ctgMember_Quentin(redirectUrl)
  }
  rCouMember_Litzy(redirectUrl = '/') {
    cy.signOut()
    this.couMember_Litzy(redirectUrl)
  }

  rCouAdmin_Tressie(redirectUrl = '/') {
    cy.signOut()
    this.couAdmin_Tressie(redirectUrl)
  }
  rCouFaci_Joanie(redirectUrl = '/') {
    cy.signOut()
    this.couFaci_Joanie(redirectUrl)
  }
  rCouLead_Func(redirectUrl = '/') {
    cy.signOut()
    this.couLead_Func(redirectUrl)
  }
  rCouLead_Giles(redirectUrl = '/') {
    cy.signOut()
    this.couLead_Giles(redirectUrl)
  }
  rCouLeadFaci_Maverick(redirectUrl = '/') {
    cy.signOut()
    this.couLeadFaci_Maverick(redirectUrl)
  }
  rIstAdmin_Frances(redirectUrl = '/') {
    cy.signOut()
    this.istAdmin_Frances(redirectUrl)
  }
  rIstFaci_Britney(redirectUrl = '/') {
    cy.signOut()
    this.istFaci_Britney(redirectUrl)
  }
  rIstLeadFaci_Amina(redirectUrl = '/') {
    cy.signOut()
    this.istLeadFaci_Amina(redirectUrl)
  }
  rLearningAdmin(redirectUrl = '/') {
    cy.signOut()
    this.learningAdmin(redirectUrl)
  }
  rLnAdmin_Emery(redirectUrl = '/') {
    cy.signOut()
    this.lnAdmin_Emery(redirectUrl)
  }
  rLnPathAdmin_Emery(redirectUrl = '/') {
    cy.signOut()
    this.lnPathAdmin_Emery(redirectUrl)
  }
  rCtgAdmin_Kenton(redirectUrl = '/') {
    cy.signOut()
    this.ctgAdmin_Kenton(redirectUrl)
  }
}

export default ReSignInLmsAs
