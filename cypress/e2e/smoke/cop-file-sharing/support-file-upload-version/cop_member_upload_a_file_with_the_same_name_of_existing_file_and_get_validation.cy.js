import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { SourceType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingYamlStub = new FileSharingYamlStub()
  const fileSharingAssertion = new FileSharingAssertion()

  let fileName
  let fileSharingDetail

  before(() => {
    fileSharingYamlStub._getOCoPUploadFileVersionFile((oCoPUploadFileVersion) => {
      fileSharingDetail = new FileSharingDetail(oCoPUploadFileVersion.url)
      const communityFiles = oCoPUploadFileVersion.fileSharing.communityFiles
      fileName = communityFiles.vault.uploadFiles.byOwner[0]
    })
  })

  function uploadFiles() {
    fileSharingDetail._uploadFiles([fileName], SourceType.base, (exist) => {
      if (exist) {
        fileSharingAssertion._expectToSeePopupExistingFileAlert()
      }
    })
    fileSharingDetail._visitFileSharingPage()
  }

  context(Story.supportFileUploadVersion, () => {
    it('CoP Member upload a file with the same name of existing file and get validation', () => {
      Story.ticket('QA-1569')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
      })

      context('access to community folder and upload file', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        uploadFiles()
      })

      context('access to organization folder and upload file', () => {
        fileSharingDetail._accessToOrganizationFolderDetails()
        uploadFiles()
      })

      context('access to vault folder inside community folder', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._expandCommunityFilesFolder()
        fileSharingDetail._accessToVaultFolderDetailsViaSidebar()
        fileSharingDetail._uploadFilesInVaultFolder([fileName], SourceType.base)
      })
    })
  })
})
