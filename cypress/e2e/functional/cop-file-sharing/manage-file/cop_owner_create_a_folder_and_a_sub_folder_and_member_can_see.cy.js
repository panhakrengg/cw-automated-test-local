import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing('/web/ocop-file-sharing-manage-file')
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  let firstLevelFolderName
  let secondLevelFolderName

  before(() => {
    fileSharingYamlStub._getCommunityFileYaml((communityFiles) => {
      const firstFolderLevel = communityFiles.newFolder.firstLevel
      firstLevelFolderName = firstFolderLevel.name.input.new
      secondLevelFolderName = firstFolderLevel.subFolder.secondLevel.name.input.new
    })
  })

  context(Story.manageFile, () => {
    it('CoP Owner create a folder and a sub folder and member can see', () => {
      Story.ticket('QA-202')

      context('Prepare data', () => {
        MemberManagement._loginAsOwner()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._deleteFileOrFolderViaThreedot(firstLevelFolderName)
      })

      context('CoP Owner create a folder and sub folder', () => {
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToCommunityFilesFolderDetails()
        manageFileSharing._createNewFolder(firstLevelFolderName)
        manageFileSharing._accessToFolderDetailsViaFolderName(firstLevelFolderName)
        manageFileSharing._createNewFolder(secondLevelFolderName)
      })

      context('Verify CoP Member can see the folder that owner created', () => {
        cy.signOut()
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingAssertion._expectToSeeFileOrFolder(firstLevelFolderName)
        fileSharingDetail._accessToFolderDetailsViaFolderName(firstLevelFolderName)
        fileSharingAssertion._expectToSeeFileOrFolder(secondLevelFolderName)
      })
    })
  })
})
