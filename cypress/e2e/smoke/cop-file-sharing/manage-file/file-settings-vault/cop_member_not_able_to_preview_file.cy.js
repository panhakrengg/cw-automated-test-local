import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, { retries: 1 }, () => {
  context(Story.fileSettingsVault, () => {
    const folderName = 'Folder Not For Preview Files'
    const fileSharingDetail = new FileSharingDetail(
      '/web/ocop-file-sharing-for-functionality-vault'
    )
    const fileSharingAssertion = new FileSharingAssertion()

    function verifyClickOnEncryptedFile() {
      fileSharingDetail._getAllTableRows().each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('a.file-name').click()
        })
        fileSharingAssertion.expectToDownloadVaultFileNotPreview()
      })
    }

    it('CoP Member not able to see a preview vault file popup', () => {
      Story.ticket('QA-1661')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToVaultFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
      verifyClickOnEncryptedFile()
    })
  })
})
