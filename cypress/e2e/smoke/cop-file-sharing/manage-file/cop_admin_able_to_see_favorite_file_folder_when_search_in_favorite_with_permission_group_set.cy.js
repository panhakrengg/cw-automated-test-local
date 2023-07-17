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
  const baseSearchText = 'CoP Admin - Favorite To Be Found'

  let folderName
  let subFolderName
  let subFolderPath
  let favoriteFolder
  let favoriteFile
  let searchTexts = []

  before(() => {
    fileSharingYamlStub._getFolderForSearchFunctionality((folderForSearchFunctionality) => {
      folderName = folderForSearchFunctionality.name
      subFolderPath = folderForSearchFunctionality.subFolder.folderForFavoriteSearch
      subFolderName = subFolderPath.name
      favoriteFolder = subFolderPath.subFolder.favoriteToBeFoundFolder.name
      favoriteFile = subFolderPath.subFolder.uploadFiles.byAdminJson.files
    })
    searchTexts = [baseSearchText, baseSearchText.concat(' Folder')]
  })

  context(Story.manageFile, () => {
    it('Cop Admin able to see favorite file folder when_search_in_favorite', () => {
      Story.ticket('QA-1539')

      context('Prepare data', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
      })

      context('Mark folder as favorite', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._accessToFolderDetailsViaFolderName(folderName)
        manageFileSharing._accessToFolderDetailsViaFolderName(subFolderName)
        manageFileSharing._revokeMarkAsFavorite(favoriteFolder)
        manageFileSharing._revokeMarkAsFavorite(favoriteFile[0])
      })

      context('Navigate to Favorite folder then search folder and file', () => {
        manageFileSharing._accessToFavoriteFolderDetails()
        searchTexts.forEach((text) => {
          manageFileSharing._searchFileOrFolderByName(text, () => {
            fileSharingAssertion._expectToSeeFileOrFolder(favoriteFolder)
            fileSharingAssertion._expectToSeeCorrectTableRows(1)
            manageFileSharing._executeClearButtonAction()
          })
        })
      })
    })
  })
})
