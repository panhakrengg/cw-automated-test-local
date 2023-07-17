import SignInAs from '../../utilities/SignInAs'
import MyProfileIntercept from '../base/MyProfileIntercept'

export default class MyProfileLoginStub {
  itc = new MyProfileIntercept()
  profileUrl = '/web/my-profile/profile'

  waitRenderProfile() {
    cy.wait(3000)
  }

  asOrgAdmin(redirect) {
    this.itc.getProfileOptions.set()
    SignInAs.orgAdmin(redirect)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  asTeamLeader(redirect = '/') {
    this.itc.getProfileOptions.set()
    SignInAs.teamLeaderRootOrgUnit(redirect)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  asFreemiumUser(redirect = '/') {
    this.itc.getProfileOptions.set()
    SignInAs.freemiumUser(redirect)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  asNormalUser(redirect = '/') {
    this.itc.getProfileOptions.set()
    SignInAs.cwNormalUser(redirect)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  asInstanceMember(redirect = '/') {
    this.itc.getProfileOptions.set()
    SignInAs.instanceMember(redirect)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  asCiMember(redirect = '/') {
    this.itc.getProfileOptions.set()
    SignInAs.ciMember(redirect)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsTeamLeader() {
    this.itc.getProfileOptions.set()
    SignInAs.teamLeaderRootOrgUnit(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsOrgAdmin() {
    this.itc.getProfileOptions.set()
    SignInAs.orgAdmin(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsOrgMember() {
    this.itc.getProfileOptions.set()
    SignInAs.orgMember(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsFreeUser() {
    this.itc.getProfileOptions.set()
    SignInAs.freemiumUser(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsNormalUser() {
    this.itc.getProfileOptions.set()
    SignInAs.cwNormalUser(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsInstanceMember() {
    this.itc.getProfileOptions.set()
    SignInAs.instanceMember(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsCiMember() {
    this.itc.getProfileOptions.set()
    SignInAs.ciMember(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsAuPfSwitchCoP() {
    this.itc.getProfileOptions.set()
    SignInAs.auPfSwitchCoP(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  toProfilePageAsExitedOrgMemberSimo() {
    this.itc.getProfileOptions.set()
    SignInAs.exitedOrgMemberSimo(this.profileUrl)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }

  open(path, role) {
    this.itc.getProfileOptions.set()
    cy.visitThenSignIn(path, role)
    this.itc.getProfileOptions.wait()
    this.waitRenderProfile()
  }
}
