import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, () => {
  let copObj
  const setupCoP = new SetupCoP()

  before(() => {
    cy.stubCommunity('cop-administration/manage-members/cop-manage-members', 'tPCoPAcceptDenyWeb')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.communityManageMembers, () => {
    it('Setup CoP "TPCoP Func For Accept_Deny from Web"', () => {
      setupCoP.setCoPBaseYaml(copObj)

      SignInAs.orgAdmin_Amy()
      setupCoP.createCommunity()
    })
  })
})
