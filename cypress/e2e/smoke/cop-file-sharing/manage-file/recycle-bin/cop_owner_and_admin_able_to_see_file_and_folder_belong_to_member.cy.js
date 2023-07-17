import ManageFileSharing from '../../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()
  const manageFileSharing = new ManageFileSharing()
  const fileSharingYamlStub = new FileSharingYamlStub()

  context(Story.manageFileRecycleBin, () => {
    let fileSharing
    let memberDeletedFolderName
    let memberDeletedFileName
    let cmDeletedFolderName
    let cmDeletedFileName

    before(() => {
      fileSharingYamlStub._getVaultEnabledCop((cop) => {
        manageFileSharing._setCopUrl(cop.url)
        fileSharing = cop.fileSharing
        memberDeletedFolderName = fileSharing.deletedFolders[3]
        memberDeletedFileName = fileSharing.deletedFiles[3]
        cmDeletedFolderName = fileSharing.deletedFolders[4]
        cmDeletedFileName = fileSharing.deletedFiles[4]
      })
    })

    it('CoP Owner, CoP Admin able to see deleted file/folder belong to CoP Member, Contact manager', () => {
      Story.ticket('QA-1681')

      context('Admin able to see files and folder belong to member', () => {
        MemberManagement._loginAsAdmin()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToRecycleBin()
        fileSharingAssertion._expectToSeeFilesOrFolders([
          memberDeletedFolderName,
          memberDeletedFileName,
          cmDeletedFolderName,
          cmDeletedFileName,
        ])
      })

      context('Owner able to see files and folder belong to member', () => {
        MemberManagement._loginAsOwner()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToRecycleBin()
        fileSharingAssertion._expectToSeeFilesOrFolders([
          memberDeletedFolderName,
          memberDeletedFileName,
          cmDeletedFolderName,
          cmDeletedFileName,
        ])
      })
    })
  })
})
