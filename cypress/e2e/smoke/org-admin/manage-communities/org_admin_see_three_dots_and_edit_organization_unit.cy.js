import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import { SubOrgConst } from '../../../../classes/org-management/base-org-management/SubOrgStub'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  const orgManageCommunity = new OrgManageCommunity()
  beforeEach(() => {
    orgManageCommunity.setItcCommunities()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_COMMUNITIES)
  })

  context(Story.manageCommunities, () => {
    it('Org Admin able to see three dots option then click edit organization unit and show popup', () => {
      Story.ticket('QA-449')
      cy.selectItemPerPage(75)
      orgManageCommunity.waitCommunityTableRender()
      cy.cwRowName('WebLearn Org Automate').within(($community) => {
        orgManageCommunity.clickThreeDotsEditOrgUnit($community)
        orgManageCommunity.expectEditOrgUnitTitle($community)
        orgManageCommunity.getPopupBy($community, (communityPopupBody) => {
          describe('Show edit organization unit', () => {
            orgManageCommunity.expectOrgUnitLabelPopup(communityPopupBody)
            orgManageCommunity.expectMultiSelectTagPopup(communityPopupBody)
            orgManageCommunity.expectPopupButtons(communityPopupBody)
          })

          orgManageCommunity.clickMultiSelect()
          describe('Dropdown show sub org unit items more than 2', () => {
            orgManageCommunity.expectOrgUnitDropDownItems(communityPopupBody, 2)
          })

          describe(`List has sub org "${SubOrgConst.DRAWING_FEATURE_PLAN}"`, () => {
            orgManageCommunity.expectDrawFeaturePlan(communityPopupBody)
          })
        })
      })
    })
  })
})
