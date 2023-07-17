import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import CommunityStorageDetail from '../../../../classes/org-management/org-admin/manage-storage/CommunityStorageDetail'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let suite, staticData, webLearnInternational
  let communityStorageDetail = new CommunityStorageDetail()

  before(() => {
    cy.readFile('cypress/fixtures/organization/weblearn/org-admin/manage-storage.yaml').then(
      (manageStorageString) => {
        suite = YAML.parse(manageStorageString).ManageStorageSuite
        staticData = YAML.parse(manageStorageString).ManageStorageStatic
        webLearnInternational = suite.orgMgt.rootOrg.webLearnUnit.communities.webLearnInternational
      }
    )
  })

  beforeEach(() => {
    communityStorageDetail.setItcCommunities()
    communityStorageDetail.setItcOverview()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_STORAGE)
    communityStorageDetail.waitOverview()
    communityStorageDetail.goToStorageDetail(communityStorageDetail.viewCommunity)
  })

  context(Story.manageStorage, () => {
    it('Org Admin search a cop in list cop Community storage detail', () => {
      Story.ticket('QA-228')
      cy.cecCard().inputFeedback().type(`"${webLearnInternational.label}" {enter}`)
      communityStorageDetail.waitCommunities()
      cy.cwTable().rowName(webLearnInternational.label).should('have.length', 1)
    })
  })
})
