import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  let parentFolderName
  let folderName
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getExistingFileYaml((existingFolder) => {
      const folderForCoPAdminInstance = existingFolder.folderForCoPAdmin
      parentFolderName = folderForCoPAdminInstance.name
      folderName = folderForCoPAdminInstance.subFolder.folderForMarkAsFavorite.name
    })
  })
  context(Story.manageFile, () => {
    it('CoP Admin mark folder as favorite', () => {
      Story.ticket('QA-877')

      context('Prepare data', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
      })

      context('Mark folder as favorite', () => {
        manageFileSharing._accessToFolderDetailsViaFolderName(parentFolderName)
        manageFileSharing._markAsFavorite(folderName)
      })

      context('Expect to see folder marked as favorite', () => {
        manageFileSharing._accessToFavoriteFolderDetails()
        fileSharingAssertion._expectToSeeFileOrFolder(folderName)
      })

      context('revert mark folder as favorite', () => {
        manageFileSharing._removeFavorite(folderName)
      })
    })
  })
})
