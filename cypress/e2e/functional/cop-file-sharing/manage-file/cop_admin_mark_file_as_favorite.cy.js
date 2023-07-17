import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import MemberManagement
  from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'

describe(Epic.CoPFileSharing, () => {
  let parentFolderName
  let fileName
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getExistingFileYaml((existingFolder) => {
      const folderForCoPAdminInstance = existingFolder.folderForCoPAdmin
      parentFolderName = folderForCoPAdminInstance.name
      fileName = folderForCoPAdminInstance.uploadFiles.byAdminJson.files[0]
    })
  })
  context(Story.manageFile, () => {
    it('CoP Admin mark file as favorite', () => {
      Story.ticket('QA-878')
      MemberManagement._loginAsAdmin()

      context('Prepare data', () => {
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._accessToFolderDetailsViaFolderName(parentFolderName)
      })

      context('Mark file as favorite', () => {
        manageFileSharing._markAsFavorite(fileName)
      })

      context('Expect to see favorite file', () => {
        manageFileSharing._accessToFavoriteFolderDetails()
        fileSharingAssertion._expectToSeeFileOrFolder(fileName)
      })

      context('Reset favorite file', () => {
        manageFileSharing._removeFavorite(fileName)
      })
    })
  })
})
