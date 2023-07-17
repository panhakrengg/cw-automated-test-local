import Environment from '../../base/Environment'
import UserRole from '../../utilities/user-role/UserRole'

class MyOrganizationProfile {
  memberFronted = UserRole.DESIGN_FRONTEND.MEMBERS
  nonOrgUnitMember = UserRole.ORG_MEMBER.NORMAL
  env = new Environment()
  getMyProfileUrl() {
    return '/web/my-profile/profile'
  }
  accessMyProfile(role) {
    cy.visitThenSignIn(this.getMyProfileUrl(), role)
  }
  verifyOrgProfileStatusBlock(webLearnStatusBlock) {
    this.checkOrgUnitImage(webLearnStatusBlock)
    this.checkOrgStatus(webLearnStatusBlock.memberStatus)
    this.checkOrgStatus(webLearnStatusBlock.memberGroup)
    this.checkOrgStatus(webLearnStatusBlock.MemberSubGroup)
  }
  VerifyOrgProfileTabVisible(label) {
    cy.get('.e-tab-text').contains(label).should('be.visible')
  }
  checkOrgStatus(status) {
    cy.get(`h4:contains("${status.name}")`).as('status')
    cy.get('@status').should('be.visible')
    cy.get('@status').parent().contains('span', status.value).should('be.visible')
  }
  checkOrgUnitImage(webLearnStatusBlock) {
    const imageUrl = webLearnStatusBlock.imageUrl[this.env.getEnvPrefix()]

    cy.get('.org-status-block').within(($orgStatusBlock) => {
      cy.wrap($orgStatusBlock).contains('p', webLearnStatusBlock.title).should('be.visible')
      cy.wrap($orgStatusBlock)
        .get('.aspect-ratio-bg-cover')
        .invoke('attr', 'style')
        .then(($style) => {
          expect($style).to.contains(imageUrl)
        })
      cy.wrap($orgStatusBlock).get('.aspect-ratio-bg-cover').should('be.visible')
    })
  }
  verifyOrgProfileOrgUnitBlock(orgUnit) {
    cy.contains(orgUnit.label).should('be.visible')
    cy.cwTable()
    cy.get('@cwTableTh').contains('Org Unit').should('be.visible')
    cy.get('@cwTableTh').contains('Position').should('be.visible')
    cy.get('@cwTableTh').contains('Team leader').should('be.visible')
    cy.get('@cwTableTh')
      .getTableRow(0)
      .within(($rowData) => {
        this.checkTableRowData($rowData, 1, orgUnit.designFrontend.orgUnit)
        this.checkTableRowData($rowData, 2, orgUnit.designFrontend.position)
        this.checkTableRowData($rowData, 3, orgUnit.designFrontend.teamLeader)
      })
  }
  checkTableRowData(rowData, index, content) {
    cy.wrap(rowData)
      .getTableDataByIndex(index)
      .find(`div > span:contains("${content}")`)
      .should('be.visible')
  }
  verifyOrgProfileTabNotVisible(label) {
    cy.get('.e-tab-text').find(label).should('not.exist')
  }
}

export default MyOrganizationProfile
