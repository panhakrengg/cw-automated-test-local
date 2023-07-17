import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersMembersProfileEncryption, () => {
    const manageUsers = new ManageUsers()

    before(() => {
      manageUsers.accessManageUsersTabByAdmin()
    })

    it('Verify on the sort options', () => {
      manageUsers.defineAliasForManageMemberWrapper()
      manageUsers.verifyTableColumnHeaderSortIcon()
      manageUsers.verifyTableSorting()
    })
  })
})
