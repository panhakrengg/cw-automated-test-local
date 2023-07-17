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
    it('Org Admin able to see three dots option then click change owner and show popup', () => {
      Story.ticket('QA-426')
      cy.inputByPlaceholder('Search communities', 'WebLearn Org Automate')
      cy.loadingOverlayCompleted()
      orgManageCommunity.waitCommunityTableRender()
      cy.cwRowName('WebLearn Org Automate').within(($community) => {
        orgManageCommunity.clickThreeDotsChangeOwner($community)
        orgManageCommunity.expectSwap2($community)
      })
    })
  })
})
