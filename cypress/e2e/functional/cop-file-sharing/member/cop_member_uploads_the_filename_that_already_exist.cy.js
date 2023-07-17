import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { SourceType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'

describe(Epic.CoPFileSharing, () => {
  const fileSharingYamlStub = new FileSharingYamlStub()
  const fileSharingAssertion = new FileSharingAssertion()

  let fileName
  let folderName
  let fileSharingDetail

  before(() => {
    fileSharingYamlStub._getOCoPUploadFileVersionFile((oCoPUploadFileVersion) => {
      fileSharingDetail = new FileSharingDetail(oCoPUploadFileVersion.url)
      const communityFiles = oCoPUploadFileVersion.fileSharing.communityFiles
      folderName = communityFiles.coPMemberFileVersion.name
      fileName = communityFiles.coPMemberFileVersion.uploadFiles.byMemberPayton[9]
    })
  })

  context(Story.supportFileUploadVersion, () => {
    it('CoP Member uploads the same filename that already exist', () => {
      Story.ticket('QA-1744')

      context('Login as cop member and access to cop file sharing', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
      })

      context('Reset data', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        fileSharingDetail._deleteLatestFileVersionByIndex(fileName)
      })

      context('access to community folder and upload file', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        fileSharingDetail._uploadFiles([fileName], SourceType.supportFileUploadVersion, (exist) => {
          if (exist) {
            cy.clickButtonByName(Field.YES_UPLOAD)
            cy.getSwal2ButtonHolder().find('.btn-primary').click()
          }
        })
      })

      context('expect to see new file version', () => {
        fileSharingAssertion._expectToSeeNewFileVersion(
          fileSharingDetail.fileFolderOperation,
          fileName
        )
      })
    })
  })
})
