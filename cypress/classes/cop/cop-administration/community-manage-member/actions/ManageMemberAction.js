import Field from '../../../../constants/Field'
import { CopAdministrationConstant } from '../../base/CopAdministrationConstant'
import ManageMemberItc from '../intercepts/ManageMemberItc'
import ManageMemberQuery from '../queries/ManageMemberQuery'

export default class ManageMemberAction extends ManageMemberQuery {
  removeMemberByEmail(email) {
    ManageMemberItc.itcFetchManageMember.set()
    ManageMemberItc.itcAdminDeleteMember.set()
    super.getTableRowMemberByEmail(email).within(($row) => {
      cy.wrap($row).clickDropdownItem(Field.DELETE)
    })
    cy.clickConfirmPopUp(Field.YES_REMOVE)
    ManageMemberItc.itcAdminDeleteMember.wait()
    cy.expectOverlayIsVisible()
    ManageMemberItc.itcFetchManageMember.wait()
    cy.waitLoadingOverlayNotExist()
    cy.wait(5000) //Slow when increase or decrease unread count notifications
  }

  removeMemberIfExistWith(email) {
    cy.cwTable().then(($cwTable) => {
      if ($cwTable.find(`span:contains("${email}")`).length) {
        this.removeMemberByEmail(email)
      }
    })
  }

  removeMultiMemberIfExistWith(emails = []) {
    emails.forEach((email) => {
      this.removeMemberIfExistWith(email)
    })
  }

  #searchConnectionUser(userName) {
    cy.swal2().within(() => {
      ManageMemberItc.itcSearchOrgUser.set()
      super.getInputSearchYourConnections().clear().type(userName).wait(1000)
      ManageMemberItc.itcSearchOrgUser.wait()
    })
  }

  #searchConnectionAndOrgUser(userName) {
    cy.swal2().within(() => {
      ManageMemberItc.itcSearchOrgUser.set()
      super.getInputSearchYourConnectionsAndOrganization().clear().type(userName).wait(1000)
      ManageMemberItc.itcSearchOrgUser.wait()
    })
  }

  #searchConnectionsOrgUser(userName) {
    cy.swal2().within(() => {
      ManageMemberItc.itcSearchOrgUser.set()
      super.getInputSearchInInvitePopup().clear().type(userName).wait(1000)
      ManageMemberItc.itcSearchOrgUser.wait()
    })
  }

  #clickButtonInvite() {
    ManageMemberItc.itcSearchOrgUser.set()
    super.getButtonInvite().click()
    ManageMemberItc.itcSearchOrgUser.wait()
  }

  #checkCheckboxTheFirstUser() {
    cy.get('.scroll-content-area').within(() => {
      cy.get('input[name="member"]').first().check()
    })
  }

  #checkCheckboxConnectionUser(userName) {
    cy.get('.scroll-content-area').within(() => {
      cy.getElementWithLabel(userName, 'span').siblings('input').check()
    })
  }

  #inputTextareaPersonalNote(note) {
    cy.typeInTextareaByPlaceholder(CopAdministrationConstant.personalNotePlaceholder, note)
  }

  #inputTextareaPersonalNoteForReminder(note) {
    cy.typeInTextareaByPlaceholder(CopAdministrationConstant.separatePersonalNotePlaceholder, note)
  }

  #clickButtonSendInvite() {
    ManageMemberItc.itcAdminInviteMembers.set()
    cy.clickPrimaryButton(Field.SEND_INVITE)
    ManageMemberItc.itcAdminInviteMembers.wait()
    cy.expectToastMessage(CopAdministrationConstant.sendInvitationSuccessToast)
  }

  inviteConnectionUserToJoinCop(userName, personalNote) {
    this.#clickButtonInvite()
    this.#searchConnectionUser(userName)
    this.#checkCheckboxConnectionUser(userName)
    cy.clickPrimaryButton(Field.NEXT)
    this.#inputTextareaPersonalNote(personalNote)
    this.#clickButtonSendInvite()
  }

  inviteMultipleConnectionAndOrgUsersToJoinCop(userNames = [], personalNote) {
    this.#clickButtonInvite()
    userNames.forEach((userName) => {
      this.#searchConnectionsOrgUser(userName)
      this.#checkCheckboxTheFirstUser()
    })
    cy.clickPrimaryButton(Field.NEXT)
    this.#inputTextareaPersonalNote(personalNote)
    this.#clickButtonSendInvite()
  }

  inviteUserToJoinCopViaEmail(emails = [], note) {
    this.#clickButtonInvite()
    cy.swal2().within(() => {
      super.getLinkInviteViaEmail().click()
      super.getInputInviteEmail().clear().type(emails.join(','))
      this.#inputTextareaPersonalNote(note)
    })
    this.#clickButtonSendInvite()
  }

  sendReminderToJoinCop(email, note) {
    super.getTableRowMemberByEmail(email).within(($row) => {
      ManageMemberItc.itcCheckMember.set()
      cy.wrap($row).clickDropdownItem(Field.SEND_REMINDER)
      ManageMemberItc.itcCheckMember.wait()
    })
    cy.swal2().within(() => {
      ManageMemberItc.itcRequestReminder.set()
      this.#inputTextareaPersonalNoteForReminder(note)
      cy.clickPrimaryButton(Field.SEND_REMINDER)
      ManageMemberItc.itcRequestReminder.wait()
    })
  }

  signOutAndRedirectToCreateNewAccount() {
    cy.signOut()
    //Depend on verify email function in assertion
    cy.get('@aliasCreateNewAccount').then(($url) => {
      cy.visit($url)
    })
  }
}
