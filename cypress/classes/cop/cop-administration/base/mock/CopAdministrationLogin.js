import SignInAs from '../../../../utilities/SignInAs'
import ManageMemberItc from '../../community-manage-member/intercepts/ManageMemberItc'

export default class CopAdministrationLogin {
  #cop //Required cop-manage-members.yaml => InviteMembers.cop

  setCop(cop) {
    this.#cop = cop
  }

  toCopManageMemberAsCopAdminBettye() {
    ManageMemberItc.itcFetchManageMember.set()
    SignInAs.copAdmin_Bettye(this.#cop.admin)
    ManageMemberItc.itcFetchManageMember.wait()
    ManageMemberItc.itcFetchManageMember.set()
    cy.selectItemPerPage(75)
    ManageMemberItc.itcFetchManageMember.wait()
  }

  toCopManageMemberAsCopOwnerPhoebe() {
    ManageMemberItc.itcFetchManageMember.set()
    SignInAs.copOwner_Phoebe(this.#cop.admin)
    ManageMemberItc.itcFetchManageMember.wait()
    ManageMemberItc.itcFetchManageMember.set()
    cy.selectItemPerPage(75)
    ManageMemberItc.itcFetchManageMember.wait()
  }

  toCopHomeAsConnectionUserAmanda() {
    ManageMemberItc.itcGetCommentProfile.set()
    SignInAs.myConnection_Amanda()
    cy.visit(this.#cop.url)
    ManageMemberItc.itcGetCommentProfile.wait()
  }

  toCopHomeAsConnectionUserJamison() {
    ManageMemberItc.itcGetCommentProfile.set()
    SignInAs.myConnection_Jamison()
    cy.visit(this.#cop.url)
    ManageMemberItc.itcGetCommentProfile.wait()
  }

  toCopHomeAsOrgMemberArielle() {
    ManageMemberItc.itcGetCommentProfile.set()
    SignInAs.member_Arielle()
    cy.visit(this.#cop.url)
    ManageMemberItc.itcGetCommentProfile.wait()
  }
}
