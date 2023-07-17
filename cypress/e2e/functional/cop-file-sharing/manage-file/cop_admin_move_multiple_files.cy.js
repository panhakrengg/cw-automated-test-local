import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  let manageFileSharing
  let folderForMove

  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getOCoPManageFileYaml((OCoPManageFile) => {
      manageFileSharing = new ManageFileSharing(OCoPManageFile.url)
      folderForMove = OCoPManageFile.fileSharing.communityFiles.existingFolder.folderForMove.name
    })
  })

  context(Story.manageFile, () => {
    it('CoP Admin move multiple files', () => {
      Story.ticket('QA-205')

      MemberManagement._loginAsAdmin()
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()
      manageFileSharing._accessToFolderDetailsViaFolderName(folderForMove)
      manageFileSharing._accessToFolderDetailsViaFolderName('Originate')
      manageFileSharing._checkIfFileOrFolderEmpty()
      cy.get('@isFileOrFolderEmpty').then((isFileOrFolderEmpty) => {
        if (isFileOrFolderEmpty) {
          cy.get('[title="Folder For Move (Automation Do Not Delete)"]').click()
          cy.wrap(false).as('isMove')
        } else {
          manageFileSharing._moveFilesFolderIntoACommunityFolder(folderForMove, 'Destinate')
        }
      })

      cy.get('@isMove').then((isMove) => {
        if (!isMove) {
          manageFileSharing._accessToFolderDetailsViaFolderName('Destinate')
          manageFileSharing._checkIfFileOrFolderEmpty()
          cy.get('@isFileOrFolderEmpty').then((isFileOrFolderEmpty) => {
            if (!isFileOrFolderEmpty) {
              manageFileSharing._moveFilesFolderIntoACommunityFolder(folderForMove, 'Originate')
            }
          })
        }
      })
    })
  })
})
