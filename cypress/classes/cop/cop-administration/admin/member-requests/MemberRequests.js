import BaseAdmin from '../base-admin/BaseAdmin'
import { InterceptActionRequest } from '../base-admin/InterceptActionRequest'

export class MemberRequests extends BaseAdmin {
  removeMemberRequestsWith(email) {
    InterceptActionRequest.itcAdminDeleteMember.set()
    cy.cwTable('listTable')
      .rowName(email)
      .within(($row) => {
        cy.wrap($row).getCheckbox().check()
      })
    cy.get('@cwTable').find('.cw-btn-icon').click()
    super.confirmDeleteCopMember()
    InterceptActionRequest.itcAdminDeleteMember.wait()
  }
  removeMemberRequestsIfExistWith(email) {
    cy.get('.crm-management-wrapper')
      .as('cwTable')
      .within(($cwTable) => {
        if ($cwTable.find(`span:contains("${email}")`).length) {
          this.removeMemberRequestsWith(email)
        }
      })
  }
}
