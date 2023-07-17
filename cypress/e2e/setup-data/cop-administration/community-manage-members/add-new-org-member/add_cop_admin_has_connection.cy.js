import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupNewOrgMember from '../../../../../classes/org-management/setup-data/SetupNewOrgMember'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPAdministration, () => {
  let userObj
  before(() => {
    cy.stubUser(UserRole.CoPAdministrationUser.ADMIN_BETTYE)
    cy.get('@stubUser').then((user) => {
      userObj = user
    })
  })

  context(Story.communityManageMembers, () => {
    it('CoP Admin add connection to My Connection', () => {
      new SetupNewOrgMember().fullProcessAddNewOrgMember(userObj)
    })
  })
})
