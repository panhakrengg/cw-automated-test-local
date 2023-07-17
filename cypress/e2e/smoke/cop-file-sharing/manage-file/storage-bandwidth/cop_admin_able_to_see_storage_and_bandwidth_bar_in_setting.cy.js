import ManageFileSharing from '../../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  context(Story.manageFileStorageAndBandwidth, () => {
    const manageFileSharing = new ManageFileSharing('/web/ocop-storage-and-bandwidth-file-sharing')
    const fileSharingAssertion = new FileSharingAssertion()
    it('CoP Admin able to see download bandwidth and storage bar in setting', () => {
      Story.ticket('QA-1561')
      MemberManagement._loginAsOrgMemberJason()
      manageFileSharing._visitFileSharingPage()
      manageFileSharing.clickSetting()
      fileSharingAssertion.expectShowStorageAndBandwidthMessageIsVisible()
    })
  })
})
