import ManageFileSharing from '../../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingAssertion = new FileSharingAssertion()

  context(Story.fileSettingsVault, () => {
    it('CoP Admin able to see disable Vault folder', () => {
      Story.ticket('QA-1645')

      MemberManagement._loginAsAdmin()
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()
      fileSharingAssertion.expectVaultFolderExist()
      manageFileSharing.clickSetting()
      manageFileSharing.checkVaultFolder()
      fileSharingAssertion.expectToSeeWarningPrompt()
    })
  })
})
