import OrgStructureIntercept from '../base/OrgStructureIntercept'

class OrgUnitAction {
  itc = new OrgStructureIntercept()

  accessManageMembersTab() {
    this.itc.fetchOrgTeamLeaders.set()
    this.itc.fetchOrgMembers.set()
    cy.get(
      '#_orgManagementPortlet_tabListDesktop > .e-tab-header > .e-toolbar-items > .e-toolbar-item'
    )
      .eq(1)
      .click()
    this.itc.fetchOrgTeamLeaders.wait()
    this.itc.fetchOrgMembers.wait()
    cy.wait(1000)
  }

  accessSubOrgUnit(name = 'Design Frontend') {
    this.itc.fetchOrgNav.set()
    cy.cecCard().cardMainContent().find('.border-bottom:nth-child(3)').cwTable().clickRowName(name)
    this.itc.fetchOrgNav.wait()
  }
}

export default OrgUnitAction
