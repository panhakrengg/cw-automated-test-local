import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, () => {
  let copObj
  const setupCoP = new SetupCoP()

  before(() => {
    cy.stubCommunity('cop-administration/manage-members/cop-manage-members', 'tCoPAssignRole')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.communityManageMembers, () => {
    it('Setup CoP "TCoP Func For Assign Role"', () => {
      setupCoP.setCoPBaseYaml(copObj)

      SignInAs.orgAdmin_Amy()
      setupCoP.createCommunity()
      setupCoP.visitThenEnableContactManagementFeature()
      setupCoP.inviteMembersThenAccept()
    })
  })
})
