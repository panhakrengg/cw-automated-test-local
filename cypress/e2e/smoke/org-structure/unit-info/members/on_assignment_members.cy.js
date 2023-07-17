import Epic from '../../../../../classes/Epic'
import OrgUnitInfo from '../../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  const orgUnitInfo = new OrgUnitInfo()
  before(() => {
    orgUnitInfo.login.asOrgAdmin()
    cy.intercept(
      '*&_orgManagementPortlet_keywords=&p_p_resource_id=%2Forg_management%2Ffetch_assignment_members'
    ).as('fetchAssignmentMembers')
    cy.get(
      '#_orgManagementPortlet_tabListDesktop > .e-tab-header > .e-toolbar-items > .e-toolbar-item'
    )
      .eq(2)
      .click()
  })

  context('On-Assignment Members List', () => {
    it('Give Org Admin to access On-Assignment Members tab and see the members list', () => {
      cy.wait('@fetchAssignmentMembers').then((res) => {
        cy.get(
          '#_orgManagementPortlet_orgManagement .cec-card__main-content .member-wrapper'
        ).within(($memberContent) => {
          cy.wrap($memberContent)
            .find('> div > h1.font-weight-light')
            .contains('On-Assignment Members (')
          cy.wrap($memberContent)
            .find('.search-box-wrapper > div.has-search > input[type="text"]')
            .should('have.attr', 'placeholder', 'Search members')
            .and('be.visible')
            .type('Hello World {enter}')
            .clear()
          cy.wrap($memberContent)
            .cwTable()
            .within(($memberTable) => {
              cy.wrap($memberTable).getTableHeader('Member name').should('be.visible')
              cy.wrap($memberTable).getTableHeader('Assignment type').should('be.visible')
              cy.wrap($memberTable).getTableHeader('2-Step verification').should('be.visible')
            })
          const { success, result } = res.response.body
          if (success && result) {
            const parseResult = JSON.parse(result)
            if (parseResult.total == 0) {
              cy.wrap($memberContent)
                .find('.taglib-empty-result-message')
                .contains('div.sheet-text', 'No data')
            }
          }
        })
      })
    })
  })
})
