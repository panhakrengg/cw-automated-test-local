import BaseAdmin from '../base-admin/BaseAdmin'
import Field from '../../../../constants/Field'

export class ManageMembers extends BaseAdmin {
  removeMember(email) {
    cy.getElementWithLabel(email, 'span')
      .parents('tr')
      .within(() => {
        cy.getThreeDots().click()
        cy.get('@cwThreeDots').clickDropdownName(Field.DELETE)
      })
    cy.wait(6000)
    super.confirmDeleteCopMember()
  }
  removeMemberIfExistWith(email) {
    cy.cwTable().then(($cwTable) => {
      if ($cwTable.find(`span:contains("${email}")`).length) {
        this.removeMember(email)
      }
    })
  }
}
