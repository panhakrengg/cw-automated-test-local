import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  let folderName
  let filesName
  let validFiles

  before(() => {
    fileSharingYamlStub._getFolderForUploadMultipleFiles((folderInstance) => {
      folderName = folderInstance.name
      filesName = folderInstance.uploadFiles.byMemberPayton.files
      validFiles = [filesName[1], filesName[2]]
    })
  })

  context(Story.manageFile, () => {
    it('Cop Member upload multiple files that include invalid files', () => {
      Story.ticket('QA-1619')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        fileSharingDetail._deleteFilesOrFoldersViaSelect(validFiles)
      })

      context('Cop Member upload multiple files that include invalid file and remove it', () => {
        fileSharingDetail._uploadInvalidFiles(filesName)
      })

      context('Cop Admin upload files into folder', () => {
        fileSharingAssertion._expectNotToSeeFilesOrFolders([filesName[0]])
        fileSharingAssertion._expectToSeeFilesOrFolders(validFiles)
      })
    })
  })
})
