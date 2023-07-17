import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import OnlyOffice from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/OnlyOffice'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()
  const officeVaultFileXls = 'preview-vault-by-search'
  const officeFileXls = 'preview-in-community-by-search'

  context(Story.manageFileOnlyOffice, () => {
    let cop

    before(() => {
      new FileSharingYamlStub()._getOCoPDisplayThumbnailAndPreviewFileYaml(
        (OCoPDisplayThumbnailAndPreviewFile) => {
          cop = OCoPDisplayThumbnailAndPreviewFile
        }
      )
      OnlyOffice.interceptDocServer()
    })

    it('CoP Member view an office file as spreadsheet type ods in Community Files', () => {
      Story.ticket('QA-1536')
      const fileSharingDetail = new FileSharingDetail(cop.url)
      MemberManagement._loginAsCoPMemberElder50()
      cy.logInTestCase('Search a vault file .ods and check dropdown')
      fileSharingDetail._searchInFolderName(officeVaultFileXls, () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
      })
      fileSharingAssertion.expectedEncryptedFileThreeDot(officeVaultFileXls)

      cy.logInTestCase('Search a file .ods and check dropdown')
      fileSharingDetail._searchInFolderName(officeFileXls, () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
      })
      fileSharingDetail._viewFile(officeFileXls)
      fileSharingAssertion.expectShowOnlyOfficeDoc(officeFileXls + '-17-file-ODS.ods')
    })
  })
})
