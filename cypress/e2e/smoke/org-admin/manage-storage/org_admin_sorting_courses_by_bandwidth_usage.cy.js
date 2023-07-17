import Epic from '../../../../classes/Epic'
import LmsStorageDetail from '../../../../classes/org-management/org-admin/manage-storage/LmsStorageDetail'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const lmsStorageDetail = new LmsStorageDetail()
  context(Story.manageStorage, () => {
    it('Org Admin sorting list courses bandwidth usage', () => {
      Story.ticket('QA-553')
      lmsStorageDetail.setItcCourses()
      lmsStorageDetail.accessManageStorageByOrgAdmin()
      lmsStorageDetail.goToStorageDetail(lmsStorageDetail.viewLms)
      lmsStorageDetail.waitItcCourses()
      lmsStorageDetail.clickSortBy('Bandwidth usage', lmsStorageDetail.itcFetchCourses)
      lmsStorageDetail.verifyCoursesSortDescendingByBandwidthUsage()
    })
  })
})
