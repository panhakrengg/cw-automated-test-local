import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  context(Story.fileSettingsVault, () => {
    const fileSharingAssertion = new FileSharingAssertion()
    const fileSharingYamlStub = new FileSharingYamlStub()
    const fileSharingDetail = new FileSharingDetail(
      '/web/ocop-file-sharing-for-functionality-vault'
    )

    let memberFolder
    let memberFile
    let adminFolder
    let adminFile

    function accessVaultFolder() {
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToVaultFolderDetails()
    }

    function verifyFolderDetails(folderDetail, isOwner = true) {
      cy.logInTestCase(`Member View His Folder ${folderDetail.name}`)
      fileSharingDetail._viewFileOrFolderDetailViaThreeDot(folderDetail.name)
      fileSharingAssertion.expectToShowVaultFolderDetail(folderDetail, isOwner)
    }

    function verifyFileDetails(folderDetail, fileDetail, isOwner = true) {
      cy.logInTestCase(`Member View His File ${fileDetail.name}`)
      fileSharingDetail._accessToFolderDetailsViaFolderName(folderDetail.name)
      fileSharingDetail._viewFileOrFolderDetailViaThreeDot(fileDetail.name)
      fileSharingAssertion.expectToShowVaultFileDetail(fileDetail, isOwner)
    }

    before(() => {
      fileSharingYamlStub._getVaultFileAndFolderDetails(($fileAndFolderDetails) => {
        memberFolder = $fileAndFolderDetails.memberFolder
        memberFile = $fileAndFolderDetails.memberFile
        adminFolder = $fileAndFolderDetails.adminFolder
        adminFile = $fileAndFolderDetails.adminFile
      })
    })

    it('CoP Member able to see information on file/folder detail', () => {
      Story.ticket('QA-1668')

      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      accessVaultFolder()

      verifyFolderDetails(memberFolder)
      verifyFileDetails(memberFolder, memberFile)

      cy.logInTestCase('Go back')
      accessVaultFolder()

      verifyFolderDetails(adminFolder, false)
      verifyFileDetails(adminFolder, adminFile, false)
    })
  })
})
