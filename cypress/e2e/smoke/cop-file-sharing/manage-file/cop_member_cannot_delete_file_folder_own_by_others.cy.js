import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import {
  DropdownMenu,
  RootFolderType
} from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  let files
  const VAULT_FOLDER_NAME = RootFolderType.vault
  const manageFileSharing = new ManageFileSharing(
    '/web/ocop-file-sharing-display-thumbnail-and-preview-files'
  )
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getPreviewSuiteFileYaml((entry) => {
      files = entry
    })
  })

  context(Story.manageFile, () => {
    it('CoP Member cannot delete file/folder own by others', () => {
      Story.ticket('QA-1568')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberElder50()
        manageFileSharing._visitFileSharingPage()
      })

      context('Favorite folder', () => {
        manageFileSharing._accessToFavoriteFolderDetails()
        fileSharingAssertion._expectNotToSeeFileFolderThreedotOption(
          VAULT_FOLDER_NAME, DropdownMenu.delete)
      })

      context('Community Files folder', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        fileSharingAssertion._expectNotToSeeFileFolderThreedotOption(
          VAULT_FOLDER_NAME, DropdownMenu.delete)
        fileSharingAssertion._expectNotToSeeFileFolderThreedotOption(
          files[12], DropdownMenu.delete)
      })

      context('Platform folder', () => {
        manageFileSharing._accessToPlatformFolderDetails()
        fileSharingAssertion._expectNotToSeeFileFolderThreedotOption(files[6],
          DropdownMenu.delete)
      })

      context('Organization folder', () => {
        manageFileSharing._accessToOrganizationFolderDetails()
        fileSharingAssertion._expectNotToSeeFileFolderThreedotOption(files[13],
          DropdownMenu.delete)
      })
    })
  })
})
