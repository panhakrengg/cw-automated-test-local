import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()

  context(Story.fileSettingsShareToFolders, () => {
    const file = '797973filesharing.docx'
    const folder = '797973foldersharing'
    it('Org Unit Member access share folder from an Organization CoP', () => {
      Story.ticket('QA-1724')
      const fileSharingDetail = new FileSharingDetail('/web/hill-group')
      MemberManagement._loginAsOrgMemberElucy()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToPlatformFolderDetails()
      fileSharingAssertion._expectToSeeFilesOrFolders([file, folder])
      fileSharingDetail._accessToOrganizationFolderDetails()
      fileSharingAssertion._expectToSeeFilesOrFolders([file, folder])
    })
  })
})
