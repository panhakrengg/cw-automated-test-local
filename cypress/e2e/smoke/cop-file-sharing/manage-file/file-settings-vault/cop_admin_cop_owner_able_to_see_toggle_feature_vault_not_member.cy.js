import ManageFileSharing from '../../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingAssertion = new FileSharingAssertion()

  function verifySettingForEnableVault(manageFileSharing, fileSharingAssertion) {
    manageFileSharing._visitFileSharingPage()
    manageFileSharing._accessToCommunityFilesFolderDetails()
    fileSharingAssertion.expectVaultFolderExist()
    manageFileSharing.clickSetting()
    fileSharingAssertion.expectToSeeEnableVault()
  }

  context(Story.fileSettingsVault, () => {
    it('CoP Admin, CoP Owner able to see toggle feature vault but not CoP Member', () => {
      Story.ticket('QA-1648')
      cy.logInTestCase('CoP Admin see enable vault')
      MemberManagement._loginAsAdmin()
      verifySettingForEnableVault(manageFileSharing, fileSharingAssertion)

      cy.logInTestCase('CoP Owner see enable vault')
      MemberManagement._loginAsOwner()
      verifySettingForEnableVault(manageFileSharing, fileSharingAssertion)
    })
  })
})
