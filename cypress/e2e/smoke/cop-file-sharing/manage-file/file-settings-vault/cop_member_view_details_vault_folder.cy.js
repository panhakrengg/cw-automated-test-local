import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingAssertion = new FileSharingAssertion()

  context(Story.fileSettingsVault, () => {
    it('CoP Member view details Vault folder', () => {
      Story.ticket('QA-1651')
      let folderInfo = {
        location: `OCoP file sharing for functionality vault / Community Files`,
        createdBy: `Amy Admin`,
      }
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingAssertion.expectVaultFolderExist()
      fileSharingAssertion._expectToSeeVaultDetail(folderInfo)
    })
  })
})
