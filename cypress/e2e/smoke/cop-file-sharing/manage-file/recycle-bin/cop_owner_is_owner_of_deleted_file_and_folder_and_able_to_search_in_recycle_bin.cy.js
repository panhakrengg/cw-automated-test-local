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
    let deletedFolderToBeFoundName
    let deletedFileToBeFoundName

    before(() => {
      fileSharingYamlStub._getVaultEnabledCop((cop) => {
        manageFileSharing._setCopUrl(cop.url)
        fileSharing = cop.fileSharing
        deletedFolderToBeFoundName = fileSharing.deletedFolders[0]
        deletedFileToBeFoundName = fileSharing.deletedFiles[0]
      })
    })

    it('CoP Owner is owner of the deleted file/folder and able to search in recycle bin', () => {
      Story.ticket('QA-991')
      cy.logInTestCase('Sign In')
      MemberManagement._loginAsOwner()
      manageFileSharing._visitFileSharingPage()

      context('Search "To Be Found"', () => {
        cy.logInTestCase('Search "To Be Found"')
        manageFileSharing._accessToRecycleBin()
        manageFileSharing._searchFileOrFolderInRecycleBinByName('To Be Found')
        fileSharingAssertion._expectToSeeFileOrFolder(deletedFolderToBeFoundName)
        fileSharingAssertion._expectToSeeFileOrFolder(deletedFileToBeFoundName)
      })

      context(`Search "${deletedFileToBeFoundName}"`, () => {
        cy.logInTestCase(`Search "${deletedFileToBeFoundName}"`)
        manageFileSharing._searchFileOrFolderInRecycleBinByName(deletedFileToBeFoundName)
        fileSharingAssertion._expectToSeeFileOrFolder(deletedFileToBeFoundName)
        fileSharingAssertion._expectToSeeFileOrFolder(deletedFolderToBeFoundName)
      })

      context(`Search "nofile"`, () => {
        cy.logInTestCase(`Search "nofile"`)
        manageFileSharing._searchFileOrFolderInRecycleBinByName('nofile')
        fileSharingAssertion._expectToSeeEmptyResult()
      })

      context(`Sign In As Cop Member And Search "${deletedFileToBeFoundName}"`, () => {
        cy.logInTestCase(`Sign In As Cop Member And Search "${deletedFileToBeFoundName}"`)
        MemberManagement._loginAsCoPMemberPayton()
        manageFileSharing._visitFileSharingPage()
        manageFileSharing._accessToRecycleBin()
        manageFileSharing._searchFileOrFolderInRecycleBinByName(deletedFileToBeFoundName)
        fileSharingAssertion._expectNotToSeeFileOrFolder(deletedFolderToBeFoundName)
      })
    })
  })
})
