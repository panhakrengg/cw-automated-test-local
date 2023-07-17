import Epic from '../../../../classes/Epic'
import LmsStorageDetail from '../../../../classes/org-management/org-admin/manage-storage/LmsStorageDetail'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const lmsStorageDetail = new LmsStorageDetail()
  context(Story.manageStorage, () => {
    it('Org Admin sorting list course name', () => {
      Story.ticket('QA-534')
      lmsStorageDetail.setItcCourses()
      lmsStorageDetail.accessManageStorageByOrgAdmin()
      lmsStorageDetail.goToStorageDetail(lmsStorageDetail.viewLms)
      lmsStorageDetail.waitItcCourses()
      lmsStorageDetail.verifyCoursesSortAscendingByName()
    })
  })
})
