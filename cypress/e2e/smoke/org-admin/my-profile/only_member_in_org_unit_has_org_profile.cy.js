import Epic from '../../../../classes/Epic'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import MyOrganizationProfile from '../../../../classes/org-management/profile/MyOrganizationProfile'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const myOrganizationProfile = new MyOrganizationProfile()
  let orgProfileTabInfo

  before(() => {
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((userOrgMgString) => {
      orgProfileTabInfo = YAML.parse(userOrgMgString).MyProfile.tabs.OrganizationProfile
    })
  })

  context(Story.manageUsersOrganizationMemberProfile, () => {
    it('Org Member of org unit view My Profile', () => {
      Story.ticket('QA-385')
      myOrganizationProfile.accessMyProfile(myOrganizationProfile.memberFronted)
      myOrganizationProfile.VerifyOrgProfileTabVisible(orgProfileTabInfo.label)
      myOrganizationProfile.verifyOrgProfileStatusBlock(orgProfileTabInfo[OrgConst.ENV_NAME])
      myOrganizationProfile.verifyOrgProfileOrgUnitBlock(orgProfileTabInfo.orgUnit)
    })
  })
})
