import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import OnlyOffice from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/OnlyOffice'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()
  const officeFileXls = '13-file-xls-10.xls'

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

    it('CoP Owner view an office file as spreadsheet type xls in Organization', () => {
      Story.ticket('QA-1702')
      const fileSharingDetail = new FileSharingDetail(cop.url)
      MemberManagement._loginAsCoPMemberElder50()
      fileSharingDetail._searchInFolderName(officeFileXls, () => {
        fileSharingDetail._accessToOrganizationFolderDetails()
      })
      fileSharingDetail._viewFile(officeFileXls)
      fileSharingAssertion.expectShowOnlyOfficeDoc(officeFileXls)
    })
  })
})
