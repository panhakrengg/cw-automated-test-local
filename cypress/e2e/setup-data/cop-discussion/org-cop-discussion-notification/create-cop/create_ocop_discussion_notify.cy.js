import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInAsCoP from '../../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPDiscussions, () => {
  let copObj
  const setupCoP = new SetupCoP()
  const signInCopAs = new SignInAsCoP()

  before(() => {
    cy.stubCommunity('cop-discussion/cop_discussion_notification', 'oCoPFuncDiscussionNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.orgCoPDiscussionNotification, () => {
    it('Create "OCOP Func Discussion Notify"', () => {
      describe('Create cop & change owner from org admin', () => {
        setupCoP.setCoPBaseYaml(copObj)

        SignInAs.orgAdmin_Amy()
        setupCoP.createCommunity()
        setupCoP.changeOwnerFromOrgAdmin()
      })
      describe('New owner login then add members', () => {
        signInCopAs.owner_Kristy()
        setupCoP.inviteMembersThenAccept()
      })
      describe('Change admin role', () => {
        signInCopAs.owner_Kristy()
        setupCoP.changeToAdminRole()
      })
    })
  })
})
