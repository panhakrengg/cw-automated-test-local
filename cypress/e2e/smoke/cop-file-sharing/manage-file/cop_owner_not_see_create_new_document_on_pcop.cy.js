import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, { tags: '@skipPrd' }, () => {
  let officeFileDocx = '8-file-docx.docx'
  const fileSharingAssertion = new FileSharingAssertion()
  const manageFileSharing = new ManageFileSharing('/web/weblearn-international')

  context(Story.manageFile, () => {
    it('CoP Owner will not see button create new document on PCoP when Organization not configure OnlyOffice', () => {
      Story.ticket('QA-1706')
      MemberManagement._loginAsAdmin()
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()

      fileSharingAssertion._expectNewDocumentNotExist()
      manageFileSharing._clickFileViaThreedot(officeFileDocx)
      fileSharingAssertion._expectEditMenuNotExist()

      manageFileSharing._accessToVaultFolderDetailsViaSidebar()
      fileSharingAssertion._expectNewDocumentNotExist()

      manageFileSharing._accessToPlatformFolderDetails()
      fileSharingAssertion._expectNewDocumentNotExist()
      manageFileSharing._clickFileViaThreedot(officeFileDocx)
      fileSharingAssertion._expectEditMenuNotExist()

      manageFileSharing._accessToOrganizationFolderDetails()
      fileSharingAssertion._expectNewDocumentNotExist()
      manageFileSharing._clickFileViaThreedot(officeFileDocx)
      fileSharingAssertion._expectEditMenuNotExist()
    })
  })
})
