import ManageFileSharing from '../../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingAssertion = new FileSharingAssertion()

  context(Story.fileSettingsVault, () => {
    it('Contact Manager able to see Vault folder and 3dots option', () => {
      Story.ticket('QA-1647')

      MemberManagement._loginAsCoPMemberElder50() // Contact Manager in this cop
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()
      fileSharingAssertion._expectVaultHaveThreedotOption()
      fileSharingAssertion.expectVaultFolderExist()
      fileSharingAssertion._expectToSeeVaultDetail()
    })
  })
})
