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
    let ownerDeletedFolderName
    let ownerDeletedFileName
    let adminDeletedFolderName
    let adminDeletedFileName

    before(() => {
      fileSharingYamlStub._getVaultEnabledCop((cop) => {
        manageFileSharing._setCopUrl(cop.url)
        fileSharing = cop.fileSharing
        ownerDeletedFolderName = fileSharing.deletedFolders[1]
        ownerDeletedFileName = fileSharing.deletedFiles[1]
        adminDeletedFolderName = fileSharing.deletedFolders[2]
        adminDeletedFileName = fileSharing.deletedFiles[2]
      })
    })

    it('CoP Member not able to see others file in recycle bin', () => {
      Story.ticket('QA-1549')

      context('Expect Member Not See', () => {
        MemberManagement._loginAsCoPMemberPayton()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToRecycleBin()
        fileSharingAssertion._expectNotToSeeFilesOrFolders([
          ownerDeletedFolderName,
          ownerDeletedFileName,
          adminDeletedFolderName,
          adminDeletedFileName,
        ])
      })
    })
  })
})
