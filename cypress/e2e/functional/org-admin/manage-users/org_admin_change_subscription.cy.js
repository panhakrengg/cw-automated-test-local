const YAML = require('yamljs')
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'

describe('Org-Admin', () => {
  context('Manage Users - 3 dots option', () => {
    const manageUsers = new ManageUsers()
    let viewOrgProfile

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        const { uat } = YAML.parse(OrgMgtUsersString).Users
        viewOrgProfile = uat.viewOrgProfile
      })
    })

    it('Org Admin "Change Member Subscription" on a member', () => {
      manageUsers.findUserRowByAdmin(viewOrgProfile.email)
      manageUsers.openChangeSubscriptionPopup()
      manageUsers.defineAliasesForChangeSubscription()
      cy.get('@basic').then(($basic) => {
        cy.wrap($basic.hasClass('selected')).as('basicSelected')
      })
      manageUsers.validateChangeSubscription(viewOrgProfile.email)
    })
  })
})
