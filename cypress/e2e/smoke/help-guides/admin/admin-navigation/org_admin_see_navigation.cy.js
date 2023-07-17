import Epic from '../../../../../classes/Epic'
import Navigation from '../../../../../classes/help-guides/admin/Navigation'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

const adminHelpGuideLogin = new AdminHelpGuideLogin()
const adminNavigation = new Navigation()

describe(Epic.HelpGuides, () => {
  context('Admin - Navigation', () => {
    it('Org Admin able to see navigation', () => {
      Story.ticket('QA-271')
      adminHelpGuideLogin.signInAsOrgAdminToTab('articles')
      adminNavigation.initNavigation()
      cy.get('@navigation').within(($navigation) => {
        cy.wrap($navigation).find('a').should('have.length', '1')
        cy.wrap($navigation).should('contain.text', 'Articles')
        cy.wrap($navigation).should('not.contain.text', 'Roles')
        cy.wrap($navigation).should('not.contain.text', 'Topics')
        cy.wrap($navigation).should('not.contain.text', 'Banner')
      })
    })
  })
})
