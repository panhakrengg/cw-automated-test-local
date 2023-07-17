import Epic from '../../../../classes/Epic'
import CommunityStorageDetail from '../../../../classes/org-management/org-admin/manage-storage/CommunityStorageDetail'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const communityStorageDetail = new CommunityStorageDetail()
  let manageStorageDetails
  let storageStatic
  let communityStorage
  let manageStorageSuite
  let subOrgCommunity

  before(() => {
    cy.readFile('cypress/fixtures/organization/weblearn/org-admin/manage-storage.yaml').then(
      (manageStorageString) => {
        manageStorageDetails = YAML.parse(manageStorageString)
        storageStatic = manageStorageDetails.StorageStatic
        communityStorage = manageStorageDetails.ManageStorageStatic.communityStorage
        manageStorageSuite = manageStorageDetails.ManageStorageSuite
        subOrgCommunity =
          manageStorageSuite.orgMgt.rootOrg.webLearnUnit.subOrg.startLearningTime.communities
            .startLearningTime
      }
    )
  })

  beforeEach(() => {
    communityStorageDetail.accessManageStorageByOrgAdmin()
    communityStorageDetail.setItcCommunities()
  })

  context(Story.manageStorage, () => {
    it('Org Admin see community storage detail', () => {
      Story.ticket('QA-172')
      communityStorageDetail.goToStorageDetail(communityStorageDetail.viewCommunity)
      communityStorageDetail.verifyCommunitiesQuickTips(communityStorage.quickTip)
      communityStorageDetail.verifyDropdownChangeReport(communityStorage)
      communityStorageDetail.verifyCommunityListHeader(communityStorage)
      communityStorageDetail.verifyCircularStorage(storageStatic)
    })
  })
})
