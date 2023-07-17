import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInAsCoP from '../../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'

describe(Epic.CoPAdministration, () => {
  let copObj
  const setupCoP = new SetupCoP()

  before(() => {
    cy.stubCommunity('cop-administration/manage-members/cop-manage-members', 'mwCoPReminder')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.communityManageMembers, () => {
    it('Setup CoP "MWCoP Func For Reminder"', () => {
      describe('Create and add members', () => {
        setupCoP.setCoPBaseYaml(copObj)

        new SignInAsCoP().admin_Bettye()
        setupCoP.createCommunity()
        setupCoP.inviteMembers()
        setupCoP.inviteMembersThenAccept()
      })
      describe('change ownership', () => {
        new SignInAsCoP().admin_Bettye()
        setupCoP.changeOwnership()
      })
    })
  })
})
