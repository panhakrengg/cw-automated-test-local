import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsers, () => {
    const manageUsers = new ManageUsers()
    let removeUser

    before(() => {
      cy.stubUser(UserRole.ORG_MEMBER.REMOVE_USER)
      cy.get('@stubUser').then((user) => {
        removeUser = user
      })
    })

    it('Org Admin “Remove from organization” on a member', () => {
      Story.ticket('QA-384')
      manageUsers.accessManageUsersTabByAdmin()
      manageUsers.changeMemberFilterToExit()
      manageUsers.inviteUserIfAlreadyRemoved(removeUser)
      manageUsers.removeUserFromOrganization()
      manageUsers.validateUserAfterRemoved(removeUser.email)
    })
  })
})
