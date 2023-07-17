import Field from '../../../../constants/Field'
import { copAdminDropdownOptions } from '../../../../constants/cop/AdministrationSettings'
import { InterceptActionRequest } from './InterceptActionRequest'

class BaseAdmin {
  accessMemberRequestPage() {
    InterceptActionRequest.itcAdminFetchManageMember.set()
    cy.get('.learning-wrapper').within(($nav) => {
      cy.wrap($nav).getCwDropdown().click()
      cy.wrap($nav).clickDropdownName(copAdminDropdownOptions.memberRequests)
    })
    InterceptActionRequest.itcAdminFetchManageMember.wait()
  }
  confirmDeleteCopMember() {
    InterceptActionRequest.itcAdminFetchManageMember.set()
    cy.get('@cwTable').swal2Confirm(Field.YES_REMOVE).click()
    cy.wait(5000) //Todo: remove after performance better
    InterceptActionRequest.itcAdminFetchManageMember.wait()
  }
}

export default BaseAdmin
