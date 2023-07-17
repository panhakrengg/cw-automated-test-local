import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  let files
  const VAULT_FOLDER_NAME = 'Vault'
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
    it('CoP Member cannot rename file/folder own by others', () => {
      Story.ticket('QA-1703')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberElder50()
        manageFileSharing._visitFileSharingPage()
      })

      context('Favorite folder', () => {
        manageFileSharing._accessToFavoriteFolderDetails()
        fileSharingAssertion._expectNotToSeeFileFolderThreedotOption(VAULT_FOLDER_NAME, 'Rename')
      })

      context('Community Files folder', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        fileSharingAssertion._expectNotToSeeFileFolderThreedotOption(VAULT_FOLDER_NAME, 'Rename')
        fileSharingAssertion._expectCannotRenameFileOrFolder(files[12])
      })

      context('Platform folder', () => {
        manageFileSharing._accessToPlatformFolderDetails()
        fileSharingAssertion._expectCannotRenameFileOrFolder(files[6])
      })

      context('Organization folder', () => {
        manageFileSharing._accessToOrganizationFolderDetails()
        fileSharingAssertion._expectCannotRenameFileOrFolder(files[13])
      })
    })
  })
})
