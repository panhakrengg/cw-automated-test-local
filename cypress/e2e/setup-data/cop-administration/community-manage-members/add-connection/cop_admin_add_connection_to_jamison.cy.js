import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInAsCoP from '../../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import SetupConnection from '../../../../../classes/global-search/setup-data/SetupConnection'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPAdministration, () => {
  let userObj
  before(() => {
    cy.stubUser(UserRole.CW_USERS.MY_CONNECTION_JAMISON)
    cy.get('@stubUser').then((user) => {
      userObj = user
    })
  })

  context(Story.communityManageMembers, () => {
    it('CoP Admin add connection to My Connection', () => {
      new SignInAsCoP().admin_Bettye()
      new SetupConnection().addThenAcceptConnection(userObj)
    })
  })
})
