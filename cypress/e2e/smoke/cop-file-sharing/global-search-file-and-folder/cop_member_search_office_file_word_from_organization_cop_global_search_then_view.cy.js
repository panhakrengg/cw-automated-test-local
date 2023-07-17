import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import FileTabs from '../../../../classes/global-search/FilesTab'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  let fileName
  before(() => {
    new FileSharingYamlStub()._getOCoPGlobalSearch((oCoPGlobalSearch) => {
      fileName = oCoPGlobalSearch.fileSharing.platform.uploadFiles.byOwner[0]
    })
  })

  context(Story.globalSearchFileAndFolder, () => {
    it('CoP Member search an office file as word from Organization CoP in global search then view file', () => {
      Story.ticket('QA-1543')

      MemberManagement._loginAsCoPMemberElder50()
      new GlobalSearch().search(fileName)
      new FileTabs().clickViewFile(fileName)

      cy.verifyDownloadFileSize(fileName, 1000)
    })
  })
})
