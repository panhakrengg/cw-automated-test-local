import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing(
    '/web/ocop-file-sharing-display-thumbnail-and-preview-files'
  )
  const fileSharingAssertion = new FileSharingAssertion()

  function verifyGridView() {
    manageFileSharing._clickGridViewMode()
    fileSharingAssertion._expectShowGrid()
    manageFileSharing._clickListViewMode()
  }
  context(Story.manageFile, () => {
    it('CoP Member able to see file/folder as grid view', () => {
      Story.ticket('QA-995')

      cy.log('Prepare data')
      MemberManagement._loginAsOrgMemberLitzy5()
      manageFileSharing._visitFileSharingPage()

      cy.log('Show grid list on favorite')
      manageFileSharing._accessToFavoriteFolderDetails()
      verifyGridView()

      cy.log('Show grid list on community')
      manageFileSharing._accessToCommunityFilesFolderDetails()
      verifyGridView()

      cy.log('Show grid list on platform')
      manageFileSharing._accessToPlatformFolderDetails()
      verifyGridView()

      cy.log('Show grid list on organization')
      manageFileSharing._accessToOrganizationFolderDetails()
      verifyGridView()
    })
  })
})
