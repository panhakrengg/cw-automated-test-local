import Epic from '../../../../classes/Epic'
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
    it('Org Member but not member of org unit view My Profile', () => {
      Story.ticket('QA-308')
      myOrganizationProfile.accessMyProfile(myOrganizationProfile.nonOrgUnitMember)
      myOrganizationProfile.verifyOrgProfileTabNotVisible(orgProfileTabInfo.label)
    })
  })
})
