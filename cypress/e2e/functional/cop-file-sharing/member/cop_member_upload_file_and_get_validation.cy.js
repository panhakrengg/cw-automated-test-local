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

  before(() => {
    fileSharingYamlStub._getFolderForUploadFile((folderInstance) => {
      folderName = folderInstance.name
      filesName = folderInstance.uploadFiles.byMemberPayton.files
    })
  })

  context(Story.manageFile, () => {
    it('Cop Member upload file and get validation', () => {
      Story.ticket('QA-1690')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        fileSharingDetail._deleteFilesOrFoldersViaSelect(filesName)
      })

      context('Cop Member upload invalid file and remove it', () => {
        fileSharingDetail._uploadInvalidFileThenRemoveIt(filesName)
      })

      context('Cop Admin upload files into folder', () => {
        fileSharingAssertion._expectNotToSeeFilesOrFolders(filesName)
      })
    })
  })
})
