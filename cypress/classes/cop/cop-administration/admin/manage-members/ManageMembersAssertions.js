import Field from '../../../../constants/Field'

export class ManageMembersAssertions {
  verifyMemberWith(email, threeDotItems, callback = () => {}) {
    cy.cwTable().then(($cwTable) => {
      cy.wrap($cwTable)
        .rowName(email)
        .should('be.visible')
        .within(($row) => {
          callback($row)
          threeDotItems.forEach((item) => {
            cy.wrap($row).getDropdownName(item).should('be.visible')
          })
        })
    })
  }
  verifyMemberAsNonCwUserExistInTableWith(email) {
    this.verifyMemberWith(email, ['Send Reminder', Field.DELETE], ($row) => {
      cy.wrap($row).get('.link-icon').hasSvgIcon()
    })
  }
  verifyMemberAsCwUserExistInTableWith(email) {
    this.verifyMemberWith(email, ['Change Role', 'View Profile', Field.DELETE])
  }
}
