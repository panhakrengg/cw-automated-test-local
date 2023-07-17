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
  let videoWebmToPreview = {
    name: '',
    type: 'video/webm',
    duration: 5.356,
  }
  let videoMovToPreview = {
    name: '',
    type: 'video/mov',
    duration: 0,
  }
  let videoMp4ToPreview = {
    name: '',
    type: 'video/mp4',
    duration: 30.526667,
  }
  const fileSharingYamlStub = new FileSharingYamlStub()

  before(() => {
    fileSharingYamlStub._getPreviewSuiteFileYaml((files) => {
      videoWebmToPreview.name = files[2]
      videoMovToPreview.name = files[3]
      videoMp4ToPreview.name = files[4]
    })
  })

  context(Story.manageFile, () => {
    it('CoP Member able to see video file thumbnail and preview', () => {
      Story.ticket('QA-1554')

      cy.logInTestCase('Prepare data')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()

      cy.logInTestCase('Preview videos from favorite folder')
      fileSharingDetail._accessToFavoriteFolderDetails()
      fileSharingDetail._clickFile(videoWebmToPreview.name)
      previewFileAssertion.expectToPreviewVideo(videoWebmToPreview, 5, 5000)

      fileSharingDetail._clickFile(videoMp4ToPreview.name)
      previewFileAssertion.expectToPreviewVideo(videoMp4ToPreview, 10, 10000)

      fileSharingDetail._clickFile(videoMovToPreview.name)
      previewFileAssertion.expectToSeeDownloadVideo(videoMovToPreview)

      fileSharingDetail._clickVaultFile(videoMovToPreview.name)
      cy.expectToastMessage('Downloading...')
    })
  })
})
