const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  context(Story.manageUsers, () => {
    const manageUsers = new ManageUsers()

    before(() => {
      cy.readFile('cypress/fixtures/validation/email.yaml').then((inviteUsersString) => {
        manageUsers.findUserRowByAdmin(YAML.parse(inviteUsersString).BulkInvite.emails[0])
      })
    })

    it('Org Admin view 3dots on member in Members list', () => {
      manageUsers.clickThreeDots()
      manageUsers.verifyPendingInviteMemberThreeDotsItems()
    })
  })
})
