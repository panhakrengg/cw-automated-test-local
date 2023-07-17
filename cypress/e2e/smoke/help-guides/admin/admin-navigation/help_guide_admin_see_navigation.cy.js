import Epic from '../../../../../classes/Epic'
import Navigation from '../../../../../classes/help-guides/admin/Navigation'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

const adminHelpGuideLogin = new AdminHelpGuideLogin()
const adminNavigation = new Navigation()

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  context('Admin - Navigation', () => {
    it('Help Guide Admin able to see navigation', () => {
      Story.ticket('QA-270')
      adminHelpGuideLogin.signInAsAdminToTab('articles')
      adminNavigation.initNavigation()
      cy.get('@navigation').within(($navigation) => {
        cy.wrap($navigation).find('a').should('have.length', '4')
        cy.wrap($navigation).should('contain.text', 'Articles')
        cy.wrap($navigation).should('contain.text', 'Roles')
        cy.wrap($navigation).should('contain.text', 'Topics')
        cy.wrap($navigation).should('contain.text', 'Banner')
      })
    })
  })
})
