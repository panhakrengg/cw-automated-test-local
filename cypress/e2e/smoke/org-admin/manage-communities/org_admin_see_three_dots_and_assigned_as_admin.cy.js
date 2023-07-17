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
    it('Org Admin able to see three dots option then click Assign yourself as admin and show popup', () => {
      Story.ticket('QA-429')
      cy.inputByPlaceholder('Search communities', 'Design Frontend')
      cy.loadingOverlayCompleted()
      orgManageCommunity.waitCommunityTableRender()
      cy.cwRowName('Design Frontend').within(($community) => {
        orgManageCommunity.clickThreeDotsAssignAsAdmin($community)
        orgManageCommunity.expectSwap2($community)
      })
    })
  })
})
