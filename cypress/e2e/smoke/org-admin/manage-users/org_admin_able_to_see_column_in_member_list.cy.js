const YAML = require('yamljs')
import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsers, () => {
    const manageUsers = new ManageUsers()
    let users
    const env = new Environment()
    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        users =
          YAML.parse(OrgMgtUsersString)['Users'][env.getEnvYaml()]
      })
    })

    it('Org admin able to see column in member list', () => {
      Story.ticket('QA-425')
      manageUsers.accessManageUsersTabByAdmin()
      manageUsers.verifyTableColumnHeaders()
      manageUsers.verifyTableRowData(users)
    })
  })
})
