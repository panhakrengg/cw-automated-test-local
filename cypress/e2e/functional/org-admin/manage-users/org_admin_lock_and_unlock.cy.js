const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const manageUsers = new ManageUsers()
  let lockUser

  before(() => {
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
      const { uat } = YAML.parse(OrgMgtUsersString).Users
      lockUser = uat.lockUser
    })
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Org Admin lock/unlock member account', () => {
      manageUsers.accessManageUsersTabByAdmin()
      manageUsers.findUserRow(lockUser.email)
      manageUsers.checkLockOrUnlockAccount(lockUser.email, lockUser.givenName)
    })
  })
})
