import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SetupCoP from '../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  let copObj
  const setupCoP = new SetupCoP()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'tCoPFuncForNewPost')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.notificationsCreateAPost, () => {
    it('Create "TCoP Func For New Post"', () => {
      describe('Create cop then invite members', () => {
        setupCoP.setCoPBaseYaml(copObj)

        SignInAs.orgAdmin_Amy()
        setupCoP.createCommunity()
        setupCoP.inviteMembers()
      })
      describe('Change owner from org admin', () => {
        setupCoP.changeOwnerFromOrgAdmin()
      })
      describe('Accept invitation', () => {
        setupCoP.acceptInvitation()
      })
      describe('Change admin role and contact manager', () => {
        SignInAs.copOwner_Kristy()
        setupCoP.changeToAdminRole()
        setupCoP.changeToContactManagerRole()
      })
    })
  })
})
