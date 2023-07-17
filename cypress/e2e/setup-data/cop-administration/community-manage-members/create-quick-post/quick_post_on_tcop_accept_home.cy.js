import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInAsCoP from '../../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import SetupQuickPost from '../../../../../classes/cop/setup-data/SetupQuickPost'

describe(Epic.CoPAdministration, () => {
  let copObj, postObj
  const setupQuickPost = new SetupQuickPost()

  before(() => {
    cy.stubCommunity('cop-administration/manage-members/cop-manage-members', 'tCoPAcceptHome')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
    cy.stubQuickPost('cop-administration/post-data', 'welcomeMessage')
    cy.get('@stubQuickPost').then((stubQuickPost) => {
      postObj = stubQuickPost
    })
  })

  context(Story.communityManageMembers, () => {
    it('Create quick post on "TCoP Func For Accept from Home"', () => {
      setupQuickPost.setCoPInfoObject(copObj, postObj)

      new SignInAsCoP().admin_Kendal()
      setupQuickPost.visitThenCreateQuickPost()
    })
  })
})
