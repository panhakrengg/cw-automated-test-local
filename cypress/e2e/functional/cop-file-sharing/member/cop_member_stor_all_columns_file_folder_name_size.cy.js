import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { OnlyOfficeFileType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'

describe(Epic.CoPFileSharing, () => {
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  let folderName
  let subFoldersName
  let files

  before(() => {
    fileSharingYamlStub._getOCoPDisplayThumbnailAndPreviewFileYaml(
      (OCoPDisplayThumbnailAndPreviewFile) => {
        folderName =
          OCoPDisplayThumbnailAndPreviewFile.fileSharing.communityFiles.folderForSorting.name
      }
    )
    subFoldersName = ['a', 'b', 'c']
    files = [
      { name: 'a', type: OnlyOfficeFileType.word },
      { name: 'a1', type: OnlyOfficeFileType.spreadsheet },
      { name: 'a2', type: OnlyOfficeFileType.presentation },
      { name: 'b', type: OnlyOfficeFileType.word },
      { name: 'c', type: OnlyOfficeFileType.word },
      { name: 'd', type: OnlyOfficeFileType.spreadsheet },
    ]
  })

  context(Story.manageFile, () => {
    it('Cop member sort all columns file/folder by name/size', () => {
      Story.ticket('QA-1057')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._removeFileIfExist(folderName)
      })

      context('Create sub folder', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._createNewFolder(folderName)
        fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        subFoldersName.forEach((folderName) => {
          fileSharingDetail._createNewFolder(folderName)
        })
      })

      context('Create new files', () => {
        files.forEach((file) => {
          fileSharingDetail._newDocument(file.name, file.type)
          cy.wait(15000)
          fileSharingDetail._visitFileSharingPage(true)
          fileSharingDetail._accessToCommunityFilesFolderDetails()
          fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        })
      })

      context('Sort file or folder by column name by ASC', () => {
        fileSharingDetail._clickOnColumnHeaderByName(Field.NAME)
        fileSharingAssertion._expectToSortFileOrFolderNameByASC(
          fileSharingDetail.fileFolderOperation
        )
      })

      context('Sort file or folder by column name by DSC', () => {
        fileSharingDetail._clickOnColumnHeaderByName(Field.NAME)
        fileSharingAssertion._expectToSortFileOrFolderNameByDESC(
          fileSharingDetail.fileFolderOperation
        )
      })

      context('Sort file or folder by column size by small to big', () => {
        fileSharingDetail._clickOnColumnHeaderByName(Field.SIZE)
        fileSharingAssertion._expectToSortFileOrFolderSizeByASC(
          fileSharingDetail.fileFolderOperation
        )
      })

      context('Sort file or folder by column size by big to small', () => {
        fileSharingDetail._clickOnColumnHeaderByName(Field.SIZE)
        fileSharingAssertion._expectToSortFileOrFolderSizeByDESC(
          fileSharingDetail.fileFolderOperation
        )
      })
    })
  })
})
