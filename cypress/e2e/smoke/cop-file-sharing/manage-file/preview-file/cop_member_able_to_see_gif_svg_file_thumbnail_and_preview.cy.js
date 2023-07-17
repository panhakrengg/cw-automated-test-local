import PreviewFileAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/PreviewFileAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingDetail = new FileSharingDetail(
    '/web/ocop-file-sharing-display-thumbnail-and-preview-files'
  )
  const previewFileAssertion = new PreviewFileAssertion()
  let fileGifToPreview = ''
  let fileSvgToPreview = ''

  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getPreviewSuiteFileYaml((files) => {
      fileSvgToPreview = files[0]
      fileGifToPreview = files[5]
    })
  })

  context(Story.manageFile, () => {
    it('CoP Member able to see gif/svg file thumbnail and preview', () => {
      Story.ticket('QA-1555')

      cy.log('Prepare data')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()

      cy.log('Preview gif and svg files from platform folder')
      fileSharingDetail._accessToPlatformFolderDetails()

      fileSharingDetail._clickFile(fileGifToPreview)
      previewFileAssertion.expectToPreviewImage(fileGifToPreview)

      fileSharingDetail._clickFile(fileSvgToPreview)
      previewFileAssertion.expectToPreviewImage(fileSvgToPreview)
    })
  })
})
