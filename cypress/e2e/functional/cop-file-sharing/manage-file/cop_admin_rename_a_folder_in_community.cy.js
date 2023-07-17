import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  let oldName
  let newName
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getExistingFileYaml((existingFolder) => {
      const renameFolderInstance = existingFolder.folderForName
      oldName = renameFolderInstance.name
      newName = renameFolderInstance.rename.input.new
    })
  })

  context(Story.manageFile, () => {
    it('CoP Admin rename a folder in Community', () => {
      Story.ticket('QA-1530')

      context('Prepare data', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._renameFolder(newName, oldName)
      })

      context('CoP Admin rename a folder', () => {
        manageFileSharing._renameFolder(oldName, newName)
      })

      context('Verify folder name was changed', () => {
        fileSharingAssertion._expectToSeeFileOrFolder(newName)
        manageFileSharing._expandCommunityFilesFolder()
        fileSharingAssertion._expectToSeeFolderInFolderTree(newName)
      })

      context('Reset data', () => {
        manageFileSharing._renameFolder(newName, oldName)
      })
    })
  })
})
