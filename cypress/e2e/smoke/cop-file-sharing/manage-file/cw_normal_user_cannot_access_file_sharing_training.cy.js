import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const manageFileSharing = new ManageFileSharing('/web/tcop-permission-to-access')

  context(Story.manageFile, () => {
    it('Non-CoP Member will see page not found when access File Sharing - Training', () => {
      Story.ticket('QA-721')
      MemberManagement._loginAsAdmin()
      cy.visitUrlNotFound(manageFileSharing._getUrlCoPFileSharing())
    })
  })
})
