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
    it('Org Admin able to see three dots option then click Unassign yourself as admin and show popup', () => {
      Story.ticket('QA-430')
      cy.selectItemPerPage(75)
      orgManageCommunity.waitCommunityTableRender()
      cy.cwRowName('WebLearn Org Automate').within(($community) => {
        orgManageCommunity.clickThreeDotsUnassignAsAdmin($community)
        orgManageCommunity.expectSwap2($community)
      })
    })
  })
})
