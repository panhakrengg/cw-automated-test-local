import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'

describe(Epic.CoPFileSharing, { retries: 1 }, () => {
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  let folderForBreadcrumb
  let firstLevelFolderName
  let secondLevelFolderName
  let thirdLevelFolderName
  let baseFoldersName

  before(() => {
    fileSharingYamlStub._getExistingFileYaml((existingFolder) => {
      folderForBreadcrumb = existingFolder.folderForBreadcrumb
      firstLevelFolderName = folderForBreadcrumb.name
      secondLevelFolderName = folderForBreadcrumb.subFolder.name
      thirdLevelFolderName = folderForBreadcrumb.subFolder.folderForMarkAsFavorite.subFolder.name
      baseFoldersName = [
        RootFolderType.communityFile,
        firstLevelFolderName,
        secondLevelFolderName,
        thirdLevelFolderName,
      ]
    })
  })

  context(Story.manageFile, () => {
    it('Cop Admin able to see breadcrumb after view folder by copy link', () => {
      Story.ticket('QA-1062')

      context('Prepare data', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._deleteFileOrFolderViaThreedot(firstLevelFolderName)
      })

      context('Create folder and sub folder for breadcrumb', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._createNewFolder(firstLevelFolderName)

        manageFileSharing._accessToFolderDetailsViaFolderName(firstLevelFolderName)
        manageFileSharing._createNewFolder(secondLevelFolderName)

        manageFileSharing._accessToFolderDetailsViaFolderName(secondLevelFolderName)
        manageFileSharing._createNewFolder(thirdLevelFolderName)
        manageFileSharing._markAsFavorite(thirdLevelFolderName)
      })

      context('Navigate to Favorite Folder and expect to see breadcrumb', () => {
        manageFileSharing._accessToFavoriteFolderDetails()
        manageFileSharing._accessToFolderDetailsViaFolderName(thirdLevelFolderName)
        fileSharingAssertion._expectToSeeBreadcrumb(baseFoldersName)
      })

      context(
        'Navigate to Community File then search BreadCrumb A1 folder and expect to see breadcrumb',
        () => {
          manageFileSharing._accessToCommunityFilesFolderDetails()
          manageFileSharing._searchFileOrFolderByName(thirdLevelFolderName, () => {
            manageFileSharing._accessToFolderDetailsViaFolderName(thirdLevelFolderName)
            fileSharingAssertion._expectToSeeBreadcrumb(baseFoldersName)
          })
        }
      )
    })
  })
})
