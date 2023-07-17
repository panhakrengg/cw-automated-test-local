import ManageCommunity from '../../../../classes/cop/ManageCommunity'
import Epic from '../../../../classes/Epic'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  const orgManageCommunities = new OrgManageCommunity()
  const manageCommunities = new ManageCommunity()
  const globalSearch = new GlobalSearch()
  let webLearnOrg
  let orgCopName
  let orgCopUrl

  before(() => {
    cy.readFile('cypress/fixtures/communities.yaml').then((communitiesString) => {
      webLearnOrg = YAML.parse(communitiesString).ManageCommunitySuite.rootOrg.WebLearn
      orgCopName = webLearnOrg.community.WebLearn.name
      orgCopUrl = webLearnOrg.community.WebLearn.url
    })
  })

  context(Story.manageCommunities, () => {
    it('Org Admin create Organization CoP and member can search', () => {
      Story.ticket('QA-456')
      context('Org admin create org community', () => {
        orgManageCommunities.singInByOrgAdmin()
        orgManageCommunities.clickCreateNewCommunity()
        orgManageCommunities.clickOrgCopCard()
        manageCommunities.clickCreateYourCommunitySite()
        manageCommunities.clickNextBannerImage()
        manageCommunities.clickCreateCommunityFinalStep()
        manageCommunities.clickGoBackManageCommunities()
      })
      context('Org member search org community', () => {
        orgManageCommunities.setItcPromotion()
        SignInAs.orgMember()
        orgManageCommunities.waitPromotion()
        globalSearch.search(orgCopName)
        orgManageCommunities.expectedOrgCommunityIsSearchable(orgCopName)
      })

      context('Reset Data', () => {
        SignInAs.orgAdmin()
        new ManageCommunity(orgCopUrl).delete()
      })
    })
  })
})
