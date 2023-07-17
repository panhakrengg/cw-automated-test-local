import PreviewFileAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/PreviewFileAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, { retries: 1 }, () => {
  const fileSharingDetail = new FileSharingDetail(
    '/web/ocop-file-sharing-display-thumbnail-and-preview-files'
  )
  const previewFileAssertion = new PreviewFileAssertion()
  let fileImageToPreview = ''
  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getPreviewSuiteFileYaml((files) => {
      fileImageToPreview = files[6]
    })
  })

  context(Story.manageFile, () => {
    it('CoP Member able to see pdf file thumbnail and preview', () => {
      Story.ticket('QA-1556')

      cy.log('Prepare data')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()

      cy.log('Preview pdf files from organization folder')
      fileSharingDetail._accessToOrganizationFolderDetails()
      fileSharingDetail._clickFile(fileImageToPreview)
      previewFileAssertion.expectToPreviewPdf(fileImageToPreview)
    })
  })
})
