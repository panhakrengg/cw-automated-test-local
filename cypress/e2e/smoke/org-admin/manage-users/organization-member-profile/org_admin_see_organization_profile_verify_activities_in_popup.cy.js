const YAML = require('yamljs')
import Environment from '../../../../../classes/base/Environment'
import Epic from '../../../../../classes/Epic'
import ManageUsers from '../../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsers, () => {
    const manageUsers = new ManageUsers()
    const environment = new Environment()
    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgUsersString) => {
        manageUsers.findUserRowByAdmin(
          YAML.parse(OrgUsersString)['Users'][environment.getEnvYaml()]['viewOrgProfile']['email']
        )
      })
    })

    it('Org Admin able to see organization profile popup in manage users', () => {
      Story.ticket('QA-381')
      manageUsers.openViewOrgProfilePopup()
      manageUsers.verifyPopupViewOrgProfileActivities()
    })
  })
})
