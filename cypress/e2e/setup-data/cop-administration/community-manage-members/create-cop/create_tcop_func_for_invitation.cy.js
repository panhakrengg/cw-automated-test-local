import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, () => {
  let copObj
  const setupCoP = new SetupCoP()

  before(() => {
    cy.stubCommunity('cop-administration/manage-members/cop-manage-members', 'tCoPInvite')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.communityManageMembers, () => {
    it('Setup community "TCoP Func For Invitation"', () => {
      describe('Create and add members', () => {
        setupCoP.setCoPBaseYaml(copObj)

        SignInAs.orgAdmin_Amy()
        setupCoP.createCommunity()
        setupCoP.inviteMembersThenAccept()
      })
      describe('change admin role', () => {
        SignInAs.orgAdmin_Amy()
        setupCoP.changeToAdminRole()
      })
    })
  })
})
