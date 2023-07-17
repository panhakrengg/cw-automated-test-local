import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import {
  DropdownMenu,
  RootFolderType,
} from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  context(Story.fileSettingsVault, () => {
    const folderName = 'Folder For Copy Link (Automation Do Not Delete)'
    const fileName = '8-sample3.docx'
    const fileSharingAssertion = new FileSharingAssertion()
    it('CoP Member can access to Vault folder', () => {
      Story.ticket('QA-1654')
      const fileSharingDetail = new FileSharingDetail(
        '/web/ocop-file-sharing-for-functionality-vault'
      )
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(RootFolderType.vault)
      fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
      fileSharingAssertion._expectToSeeFileOrFolder(fileName)
      fileSharingAssertion._expectHaveThreedotOptions(fileName, [
        DropdownMenu.download,
        DropdownMenu.copyLink,
        DropdownMenu.move,
        DropdownMenu.rename,
        DropdownMenu.setPermission,
        DropdownMenu.markAsFavorite,
        DropdownMenu.delete,
        DropdownMenu.details,
      ])
    })
  })
})
