import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import ManageCommunity from './ManageCommunity'

class CommunityAdmin extends ManageCommunity {
  _itcCompleteWorkflow = new InterceptReq(
    '/subscription_admin/complete_workflow',
    'completeWorkflow'
  )

  openReviewAccessRequestPopup(email) {
    cy.getElementWithLabel(email, 'span')
      .parents('tr')
      .within(() => {
        cy.getElementWithLabel('Review', 'a').click()
      })
  }
  clickSaveReviewAccessRequest() {
    this._itcCompleteWorkflow.set()
    cy.swal2().within(() => {
      cy.btnConfirm(Field.SAVE).click()
    })
    this._itcCompleteWorkflow.wait()
  }
  approveRequestAccess(email) {
    this.openReviewAccessRequestPopup(email)
    this.clickSaveReviewAccessRequest()
  }
  removeCopMember(email) {
    cy.getElementWithLabel(email, 'span')
      .parents('tr')
      .within(() => {
        cy.getThreeDots().click()
        cy.get('@cwThreeDots').clickDropdownName(Field.DELETE)
      })
    this.confirmDeleteCopMember()
  }
  confirmDeleteCopMember() {
    this._itcAdminFetchManageMember.set()
    cy.swal2().swal2Confirm(Field.YES_REMOVE).click()
    cy.wait(5000)
    this._itcAdminFetchManageMember.wait()
  }
  goToAdminManageMemberOfNonOrgCop() {
    this.goToAdminTabOfNonOrgCopWith('manage-members', this._itcAdminFetchManageMember)
  }
  goToAdminManageMember() {
    this.goToAdminTabWith('manage-members', this._itcAdminFetchManageMember)
  }
  goToAdminManageMemberForNonOrgCop() {
    this.goToAdminTabOfNonOrgCopWith('manage-members', this._itcAdminFetchManageMember)
  }
  changeRole(option) {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).clickDropdownSelect(option)
    })
  }
  clickMemberDropdownItemBy(email, itemName) {
    cy.getElementWithLabel(email, 'span')
      .parents('tr')
      .within(() => {
        cy.getThreeDots().click()
        cy.get('@cwThreeDots').clickDropdownName(itemName)
      })
  }
  changeMemberRole(email, itemName, role) {
    this.clickMemberDropdownItemBy(email, itemName)
    this.changeRole(role)
    this.clickButtonUpdateMemberRole()
  }
  clickButtonUpdateMemberRole() {
    cy.swal2().within(() => {
      cy.btnConfirm(Field.UPDATE).click()
    })
  }
  getCurrentRole(email) {
    cy.cwTable().then(($table) => {
      cy.wrap($table)
        .find(`span:contains(${email})`)
        .parents('tr')
        .within(() => {
          cy.get('td')
            .last()
            .within(() => {
              cy.get('span.text-break').as('role')
            })
        })
    })
    return cy.get('@role').invoke('text')
  }
}

export default CommunityAdmin
