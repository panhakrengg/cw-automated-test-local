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

    it('Org Admin able to see a popup screen add existing community', () => {
      Story.ticket('QA-484')
      orgManageCommunity.waitCommunityTableRender()
      orgManageCommunity.clickAddCommunity()
      orgManageCommunity.expectAddCommunityPopup()
    })
  })
})
