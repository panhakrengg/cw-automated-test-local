import Epic from '../../../../classes/Epic'
import LmsStorageDetail from '../../../../classes/org-management/org-admin/manage-storage/LmsStorageDetail'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const lmsStorageDetail = new LmsStorageDetail()
  context(Story.manageStorage, () => {
    it('Org Admin sorting list courses storage usage', () => {
      Story.ticket('QA-552')
      lmsStorageDetail.setItcOverview()
      lmsStorageDetail.accessManageStorageByOrgAdmin()
      lmsStorageDetail.waitOverview()
      lmsStorageDetail.setItcCourses()
      lmsStorageDetail.goToStorageDetail(lmsStorageDetail.viewLms)
      lmsStorageDetail.waitItcCourses()
      lmsStorageDetail.clickSortBy('Storage usage', lmsStorageDetail.itcFetchCourses)
      lmsStorageDetail.verifyCoursesSortDescendingByStorageUsage()
    })
  })
})
