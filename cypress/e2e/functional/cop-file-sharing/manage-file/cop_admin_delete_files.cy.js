import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  let folderName
  let filesName

  before(() => {
    fileSharingYamlStub._getExistingFileYaml((existingFolder) => {
      folderName = existingFolder.folderForDeleteFiles.name
    })
    fileSharingYamlStub._getSampleSuiteFileYaml((sampleSuiteFiles) => {
      filesName = [sampleSuiteFiles.file1svg, sampleSuiteFiles.file2svg, sampleSuiteFiles.file3webm]
    })
  })

  context(Story.manageFile, () => {
    it('Cop Admin delete files', () => {
      Story.ticket('QA-838')

      context('Prepare data', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._accessToFolderDetailsViaFolderName(folderName)
        manageFileSharing._removeFilesIfExist(filesName)
      })

      context('Cop Admin upload files into folder', () => {
        manageFileSharing._uploadFiles(filesName)
      })

      context('Cop Admin delete single file and multi files ', () => {
        manageFileSharing._deleteFileOrFolderViaSelect([filesName[0]])
        manageFileSharing._deleteFileOrFolderViaSelect([filesName[1], filesName[2]])
      })

      context('Cop Admin upload files into folder', () => {
        fileSharingAssertion._expectNotToSeeFilesOrFolders(filesName)
      })
    })
  })
})
