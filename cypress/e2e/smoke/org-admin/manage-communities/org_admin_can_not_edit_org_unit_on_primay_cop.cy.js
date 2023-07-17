import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const manageCommunities = new OrgManageCommunity()
  const env = new Environment()
  context(Story.manageCommunities, () => {
    let rootOrgPrimaryCop
    let subOrgPrimaryCop

    before(() => {
      cy.readFile('cypress/fixtures/communities.yaml').then((communitiesString) => {
        const manageCommunitySuite = YAML.parse(communitiesString).ManageCommunitySuite
        rootOrgPrimaryCop =
          manageCommunitySuite.rootOrg.webLearnUnit.communities.webLearnInternational[
            env.getEnvYaml()
          ].label
        subOrgPrimaryCop =
          manageCommunitySuite.subOrg.designFrontend.communities.designFrontend.label
      })
    })

    beforeEach(() => {
      manageCommunities.setItcCommunities()
    })
    it('Org Admin not able to edit organization unit on primary cop in list manage community', () => {
      manageCommunities.singInByOrgAdmin()
      manageCommunities.waitCommunityTableRender()
      manageCommunities.expectedCopNotContainEditOrgUnitInThreeDot(rootOrgPrimaryCop)
      manageCommunities.clearSearchBox()
      manageCommunities.expectedCopNotContainEditOrgUnitInThreeDot(subOrgPrimaryCop)
    })
  })
})
