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

  let parentFolderName
  let childFolderName

  before(() => {
    fileSharingYamlStub._getCommunityFileYaml((communityFiles) => {
      const parentFolderLevel = communityFiles.newFolder.auFolderForDelete
      parentFolderName = parentFolderLevel.name.input.new
      childFolderName = parentFolderLevel.subFolder.auSubFolderForDelete.name.input.new
    })
  })

  context(Story.manageFile, () => {
    it('Cop Admin delete folder', () => {
      Story.ticket('QA-836')

      context('Prepare data', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._deleteFileOrFolderViaThreedot(parentFolderName)
      })

      context('CoP admin create a folder and sub folder', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._createNewFolder(parentFolderName)
        manageFileSharing._accessToFolderDetailsViaFolderName(parentFolderName)
        manageFileSharing._createNewFolder(childFolderName)
      })

      context('Execute delete folder', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._deleteFileOrFolderViaThreedot(parentFolderName)
      })

      context('Except CoP admin not to see deleted folder', () => {
        manageFileSharing._accessToCommunityFilesFolderDetails()
        fileSharingAssertion._expectNotToSeeFileOrFolder(parentFolderName)
        manageFileSharing._expandCommunityFilesFolder()
        fileSharingAssertion._expectNotSeeFolderInSidebar(parentFolderName)
        fileSharingAssertion._expectNotSeeFileFolderOnGlobalSearch(
          parentFolderName,
          childFolderName
        )
      })
    })
  })
})
