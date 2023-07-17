import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInAsCoP from '../../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  let copObj
  const setupCoP = new SetupCoP()
  const signInCopAs = new SignInAsCoP()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'oCoPCommentLikeNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Create "OCoP Func Comment_Like Post Notify"', () => {
      describe('Create cop then invite members', () => {
        setupCoP.setCoPBaseYaml(copObj)

        SignInAs.orgAdmin_Amy()
        setupCoP.createCommunity()
        setupCoP.inviteMembers()
      })
      describe('Set My Community as Post author', () => {
        setupCoP.visitThenSetDefaultPostAuthorMyCommunity()
      })
      describe('Change owner from org admin', () => {
        setupCoP.changeOwnerFromOrgAdmin()
      })
      describe('Accept invitation', () => {
        setupCoP.acceptInvitation()
      })
      describe('Change admin role', () => {
        signInCopAs.owner_Phoebe()
        setupCoP.changeToAdminRole()
      })
    })
  })
})
