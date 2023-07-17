import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  const orgManageCommunity = new OrgManageCommunity()
  beforeEach(() => {
    orgManageCommunity.setItcCommunities()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_COMMUNITIES)
  })

  context(Story.manageCommunities, () => {
    it('Org Admin able to see a create screen Training CoP or Organization CoP', () => {
      Story.ticket('QA-483')
      orgManageCommunity.waitCommunityTableRender()
      orgManageCommunity.clickCreateNewCommunity()
      Cypress.on('uncaught:exception', () => false) //TODO Note: This test case affect by https://khalibre.atlassian.net/browse/CW-14893
      orgManageCommunity.expectCommunityCard('Training', 1)
      orgManageCommunity.expectCommunityCard('Organization', 2)
    })
  })
})
