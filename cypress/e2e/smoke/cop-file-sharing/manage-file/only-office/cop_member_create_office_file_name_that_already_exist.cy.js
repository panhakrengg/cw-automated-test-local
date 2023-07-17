import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()
  const officeFile = '8-file-docx'

  context(Story.manageFileOnlyOffice, () => {
    let cop

    before(() => {
      new FileSharingYamlStub()._getOCoPDisplayThumbnailAndPreviewFileYaml(
        (OCoPDisplayThumbnailAndPreviewFile) => {
          cop = OCoPDisplayThumbnailAndPreviewFile
        }
      )
    })
    it('CoP Member create office files name that already exist and get validation', () => {
      Story.ticket('QA-1704')
      const fileSharingDetail = new FileSharingDetail(cop.url)
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._clickNewDocumentButton()
      fileSharingDetail._initCreateNewDocument()

      cy.logInTestCase('Click create new document button')
      fileSharingDetail._clickCreateDocumentButton()
      fileSharingAssertion.expectOnlyOfficeShowFieldRequired()

      cy.logInTestCase('Fill name and blur')
      fileSharingDetail._fillInDocumentName(officeFile)
      fileSharingAssertion.expectOnlyOfficeShowErrorIfFileExist()

      cy.logInTestCase('Fill name and change type')
      fileSharingDetail._fillInDocumentNameAndChangeType(officeFile, 'Spreadsheet')
      fileSharingAssertion.expectOnlyOfficeNotShowErrorIfFileExist()
    })
  })
})
