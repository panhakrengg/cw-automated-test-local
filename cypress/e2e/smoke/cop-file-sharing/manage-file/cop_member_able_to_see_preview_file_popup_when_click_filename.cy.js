import Environment from '../../../../classes/base/Environment'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import PreviewFileAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/PreviewFileAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import QuickAccessAction from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/QuickAccessAction'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const env = new Environment()
  const fileSharingDetail = new FileSharingDetail(
    '/web/ocop-file-sharing-display-thumbnail-and-preview-files'
  )
  const quickAccessAction = new QuickAccessAction()
  const previewFileAssertion = new PreviewFileAssertion()
  const fileSharingAssertion = new FileSharingAssertion()
  let fileImageToPreview = ''
  const fileSharingYamlStub = new FileSharingYamlStub()

  function expectShowPreviewImageOnClickALinkFile() {
    fileSharingDetail._clickFile(fileImageToPreview)
    previewFileAssertion.expectToPreviewImage(fileImageToPreview)
  }

  before(() => {
    fileSharingYamlStub._getPreviewSuiteFileYaml((files) => {
      fileImageToPreview = env.isPrd() ? files[17] : files[18]
    })
  })

  context(Story.manageFile, () => {
    it('CoP Member able to see a preview file popup when click on filename in Main Folders', () => {
      Story.ticket('QA-1552')

      cy.log('Prepare data')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()

      cy.logInTestCase('Preview file in favorite')
      fileSharingDetail._accessToFavoriteFolderDetails()
      expectShowPreviewImageOnClickALinkFile()

      cy.logInTestCase('Preview file in community')
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      expectShowPreviewImageOnClickALinkFile()

      cy.logInTestCase('Preview file in vault community')
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._expandCommunityFilesFolder()
      fileSharingDetail._accessToVaultFolderDetailsViaSidebar()
      fileSharingDetail._clickFile(fileImageToPreview)
      fileSharingAssertion._expectToSeeDownloadedFile(fileImageToPreview)

      cy.logInTestCase('Preview file in platform')
      fileSharingDetail._accessToPlatformFolderDetails()
      expectShowPreviewImageOnClickALinkFile()

      cy.logInTestCase('Preview file in organization')
      fileSharingDetail._accessToOrganizationFolderDetails()
      expectShowPreviewImageOnClickALinkFile()
    })
  })
})
