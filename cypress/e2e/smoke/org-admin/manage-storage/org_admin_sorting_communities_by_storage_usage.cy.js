import Epic from '../../../../classes/Epic'
import CommunityStorageDetail from '../../../../classes/org-management/org-admin/manage-storage/CommunityStorageDetail'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const communityStorageDetail = new CommunityStorageDetail()
  context(Story.manageStorage, () => {
    it('Org Admin sorting list community storage usage', () => {
      Story.ticket('QA-548')
      communityStorageDetail.setItcCommunities()
      communityStorageDetail.accessManageStorageByOrgAdmin()
      communityStorageDetail.goToStorageDetail(communityStorageDetail.viewCommunity)
      communityStorageDetail.waitCommunities()
      communityStorageDetail.clickSortBy(
        'Storage usage',
        communityStorageDetail.itcFetchCommunities
      )
      communityStorageDetail.verifyCommunitiesSortDescendingByStorageUsage()
    })
  })
})
