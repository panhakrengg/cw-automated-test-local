import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import GlobalSearchFileAndFolder from '../../../../classes/cop/collaboration/file-sharing/global-search/GlobalSearchFileAndFolder'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import AllTab from '../../../../classes/global-search/AllTab'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'

describe(Epic.CoPFileSharing, () => {
  let globalSearchFile
  let fileName

  before(() => {
    new FileSharingYamlStub()._getOCoPGlobalSearch((oCoPGlobalSearch) => {
      fileName = oCoPGlobalSearch.fileSharing.searchFile
      globalSearchFile = new GlobalSearchFileAndFolder(oCoPGlobalSearch)
    })
  })

  after(() => {
    const msg = 'CW-18259: File from Vault, should display "Download File" button'
    ReportDefect.markAsBETACwDefect(msg)
    ReportDefect.markAsUATCwDefect(msg)
    ReportDefect.markAsLocalCwDefect(msg)
  })

  context(Story.globalSearchFileAndFolder, () => {
    it('CoP Member search files from Organization CoP in Global search', () => {
      Story.ticket('QA-1542', ['CW-18259'])

      globalSearchFile.setFileFolderBaseYamlPath()
      cy.logInTestCase('Search file')
      MemberManagement._loginAsCoPMemberElder50()
      new GlobalSearch().search(fileName)

      cy.logInTestCase('In All Tab')
      globalSearchFile.expectToSeeFilesResultInAllPage()
      new AllTab().clickViewAll(fileName)

      cy.logInTestCase('In Files Tab')
      globalSearchFile.expectToSeeFileCardFromCommunity()
      globalSearchFile.expectToSeeFileCardFromOrganization()
      globalSearchFile.expectToSeeFileCardFromPlatform()
      globalSearchFile.expectToSeeFileCardFromVault()
    })
  })
})
