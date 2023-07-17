import ManageFileSharing from '../../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingAssertion = new FileSharingAssertion()

  context(Story.fileSettingsVault, () => {
    it('CoP Admin able to see Vault folder and 3dots option', () => {
      Story.ticket('QA-1646')

      MemberManagement._loginAsAdmin()
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()
      fileSharingAssertion._expectVaultHaveThreedotOption()
      fileSharingAssertion.expectVaultFolderExist()
      fileSharingAssertion._expectToSeeVaultDetail()
    })
  })
})
