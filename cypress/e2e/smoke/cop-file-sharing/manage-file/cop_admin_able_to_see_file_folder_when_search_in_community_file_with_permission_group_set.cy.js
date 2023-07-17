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
  const baseSearchText = `"CoP Admin - To Be Found`

  let folderForSearchSubFolder

  let toBeFoundSubFolder
  let toBeFoundSubFolders

  let toBeFoundFiles
  let toBeFoundFilesInSubFolder

  let toBeFoundFolder1HasFolders
  let toBeFoundFolder2HasFiles
  let toBeFoundFolder3
  let toBeFoundFolder4

  before(() => {
    fileSharingYamlStub._getFolderForSearchFunctionality((folderForSearchFunctionality) => {
      folderForSearchSubFolder = folderForSearchFunctionality.subFolder
      toBeFoundFiles = folderForSearchFunctionality.uploadFiles.byAdminJson.files

      toBeFoundFolder1HasFolders = folderForSearchSubFolder.toBeFoundFolder1HasFolders
      toBeFoundSubFolder = toBeFoundFolder1HasFolders.subFolder

      toBeFoundFolder2HasFiles = folderForSearchSubFolder.toBeFoundFolder2HasFiles
      toBeFoundFilesInSubFolder = toBeFoundFolder2HasFiles.uploadFiles.byAdminJson.files

      toBeFoundFolder3 = folderForSearchSubFolder.toBeFoundFolder3
      toBeFoundFolder4 = folderForSearchSubFolder.toBeFoundFolder4

      toBeFoundFiles = toBeFoundFiles.concat(toBeFoundFilesInSubFolder)
      toBeFoundSubFolders = [
        toBeFoundFolder1HasFolders.name,
        toBeFoundFolder2HasFiles.name,
        toBeFoundFolder3.name,
        toBeFoundFolder4.name,
        toBeFoundSubFolder.toBeFoundFolderSub1.name,
        toBeFoundSubFolder.toBeFoundFolderSub2.name,
        toBeFoundSubFolder.toBeFoundFolderSub3.name,
        toBeFoundSubFolder.toBeFoundFolderSub4.name,
      ]
    })
  })

  context(Story.manageFile, () => {
    it('Cop Admin able to see file folder when search in community file with permission group set', () => {
      Story.ticket('QA-888')

      context('Prepare data', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
      })

      context('Navigate to Community File folder then search', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._searchFileOrFolderByName(baseSearchText.concat('"'), () => {
          fileSharingAssertion._expectToSeeFilesOrFolders(toBeFoundSubFolders)
          fileSharingAssertion._expectToSeeFilesOrFolders(toBeFoundFiles)
          fileSharingAssertion._expectToSeeCorrectTableRows(16)
          manageFileSharing._executeClearButtonAction()
        })
      })

      context('Search Folder And Search File', () => {
        const searchInstanceValuePair = [
          { text: baseSearchText.concat(' File').concat('"'), source: toBeFoundFiles },
          { text: baseSearchText.concat(' Folder').concat('"'), source: toBeFoundSubFolders },
        ]
        searchInstanceValuePair.forEach((search) => {
          manageFileSharing._searchFileOrFolderByName(search.text, () => {
            fileSharingAssertion._expectToSeeFilesOrFolders(search.source)
            fileSharingAssertion._expectToSeeCorrectTableRows(8)
            manageFileSharing._executeClearButtonAction()
          })
        })
      })
    })
  })
})
