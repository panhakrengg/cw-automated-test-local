const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersMembersProfileEncryption, () => {
    const manageUsers = new ManageUsers()
    let viewOrgProfile

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        viewOrgProfile = YAML.parse(OrgMgtUsersString)['Users']['uat']['viewOrgProfile']
      })
    })

    it('Org Admin invite an existing email and not send email out', () => {
      Story.ticket('QA-436')
      manageUsers.accessManageUsersTabByAdmin()
      manageUsers.defineAliasForManageMemberWrapper()
      manageUsers.inviteUserToJoinOrganization(viewOrgProfile)
      manageUsers.validateEmailShouldBeNull(viewOrgProfile['email'])
    })
  })
})
