import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import { OnlyOfficeFileType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  let destinateFolderForMove
  let targetFolderToMove
  let manageFileSharing

  const auOfficeFile = 'Au File Quick Access Move into Platform'
  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getOCoPManageFileYaml((OCoPManageFile) => {
      manageFileSharing = new ManageFileSharing(OCoPManageFile.url)
      const fileSharing = OCoPManageFile.fileSharing
      destinateFolderForMove = fileSharing.communityFiles.existingFolder.folderForMove.name
      targetFolderToMove = fileSharing.platform.existingFolder.folderForMoveFromCommunity.name
    })
  })

  context(Story.manageFile, () => {
    it('CoP Admin move an office file from Quick Access into Platform', () => {
      Story.ticket('QA-205')
      MemberManagement._loginAsAdmin()
      manageFileSharing._visitFileSharingPage()

      cy.log('Reset: Go to to target folder and remove a file')
      manageFileSharing._accessToPlatformFolderDetails()
      manageFileSharing._accessToFolderDetailsViaFolderName(targetFolderToMove)
      manageFileSharing._removeFileIfExist(auOfficeFile)

      cy.log('Go to to folder')
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()
      manageFileSharing._accessToFolderDetailsViaFolderName(destinateFolderForMove)

      cy.log('Reset: File')
      manageFileSharing._removeFileIfExist(auOfficeFile)

      cy.log('Create an office file document')
      manageFileSharing._newDocument(auOfficeFile, OnlyOfficeFileType.word)

      cy.log('Go to quick access and move a file')
      manageFileSharing._visitFileSharingPage(true)
      manageFileSharing._accessToQuickAccessFolderDetails()
      manageFileSharing._moveFileFromMostRecent(auOfficeFile)
      manageFileSharing._moveFilesFolderIntoAPlatformFolder(targetFolderToMove)

      cy.log('Expect to see a file')
      manageFileSharing._accessToPlatformFolderDetails()
      manageFileSharing._accessToFolderDetailsViaFolderName(targetFolderToMove)
      manageFileSharing._getFileOrFolderByName(auOfficeFile)
    })
  })
})
