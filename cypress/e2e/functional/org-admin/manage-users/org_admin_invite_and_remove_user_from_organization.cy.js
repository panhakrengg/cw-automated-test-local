const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsers, () => {
    const manageUsers = new ManageUsers()
    let removeFreeUser, orgAdmin

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        const { uat } = YAML.parse(OrgMgtUsersString)['Users']
        removeFreeUser = uat['removeFreeUser']
        orgAdmin = uat['orgMgtAdmin']
      })
    })

    it('Org Admin invite Freemium User and then the user accept the invitation', () => {
      Story.ticket('QA-465')
      manageUsers.accessManageUsersTabByAdmin()
      manageUsers.inviteFreemiumUserToBePremiumOfOrg(removeFreeUser, orgAdmin)
      cy.wait(15000)

      manageUsers.findUserRowByAdmin(removeFreeUser['email'])
      manageUsers.removeUserFromOrganization()
      cy.wait(15000)
      manageUsers.validateUserAfterRemoved(removeFreeUser['email'], true)
    })
  })
})
