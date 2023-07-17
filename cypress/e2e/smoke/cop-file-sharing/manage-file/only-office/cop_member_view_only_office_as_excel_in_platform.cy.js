import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import OnlyOffice from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/OnlyOffice'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()
  const officeFileXls = '14-file-xlsx-10.xlsx'

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

    it('CoP Member view an office file as spreadsheet type xlsx in Platform', () => {
      Story.ticket('QA-1701')
      const fileSharingDetail = new FileSharingDetail(cop.url)
      MemberManagement._loginAsCoPMemberElder50()
      fileSharingDetail._searchInFolderName(officeFileXls, () => {
        fileSharingDetail._accessToPlatformFolderDetails()
      })
      fileSharingDetail._viewFile(officeFileXls)
      fileSharingAssertion.expectShowOnlyOfficeDoc(officeFileXls)
    })
  })
})
