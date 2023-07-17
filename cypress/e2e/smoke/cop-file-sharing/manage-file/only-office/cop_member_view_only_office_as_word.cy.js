import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import OnlyOffice from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/OnlyOffice'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()
  const mostDownloadedFile = '8-file-docx.docx'
  const recentFile = '26-file-sample_100kB.doc'

  context(Story.manageFileOnlyOffice, () => {
    let cop

    before(() => {
      new FileSharingYamlStub()._getVaultEnabledCop(
        (vaultEnableCoP) => {
          cop = vaultEnableCoP
        }
      )
    })

    function searchAndVerifyFile(file) {
      const fileSharingDetail = new FileSharingDetail(cop.url)
      cy.logInTestCase('Visit file sharing and community detail')
      fileSharingDetail._visitFileSharingPage()

      cy.logInTestCase(`Verify view ${file} file`)
      OnlyOffice.interceptDocServer()
      fileSharingDetail._viewFileViaThreedotInQuickAccess(file)
      OnlyOffice.waitUntilRender()
      fileSharingAssertion.expectShowOnlyOfficeDoc(file)
    }

    it('CoP Member view an office file as word document', () => {
      Story.ticket('QA-1538')
      MemberManagement._loginAsCoPMemberElder50()
      searchAndVerifyFile(recentFile)
      searchAndVerifyFile(mostDownloadedFile)
    })
  })
})
