import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import GlobalSearchFileAndFolder from '../../../../classes/cop/collaboration/file-sharing/global-search/GlobalSearchFileAndFolder'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import AllTab from '../../../../classes/global-search/AllTab'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'

describe(Epic.CoPFileSharing, () => {
  const allTab = new AllTab()
  const globalSearch = new GlobalSearch()
  const tCoPCodeFile = '717274'
  let fileName, folderName
  let globalSearchFileFolder

  before(() => {
    new FileSharingYamlStub()._getTCoPHackettLebsack((tCoPHackettLebsack) => {
      fileName = tCoPHackettLebsack.fileSharing.searchFile
      folderName = tCoPHackettLebsack.fileSharing.searchFolder
      globalSearchFileFolder = new GlobalSearchFileAndFolder(tCoPHackettLebsack, tCoPCodeFile)
    })
  })

  after(() => {
    const msg = 'CW-18259: File from Vault, should display "Download File" button'
    ReportDefect.markAsBETACwDefect(msg)
    ReportDefect.markAsUATCwDefect(msg)
    ReportDefect.markAsLocalCwDefect(msg)
  })

  context(Story.globalSearchFileAndFolder, () => {
    it('CoP Member search file and folder in Organization CoP associate with Org Unit', () => {
      Story.ticket('QA-1716', ['CW-18259'])

      globalSearchFileFolder.setFileFolderBaseYamlPath()
      MemberManagement._loginAsCoPMemberPayton()

      cy.logInTestCase('Search file')
      globalSearch.search(fileName)

      cy.logInTestCase('In All Tab')
      globalSearchFileFolder.expectToSeeFilesResultInAllPage()
      allTab.clickViewAll(fileName)

      cy.logInTestCase('In Files Tab')
      globalSearchFileFolder.expectToSeeFileCardFromCommunity()
      globalSearchFileFolder.expectToSeeFileCardFromOrganization()
      globalSearchFileFolder.expectToSeeFileCardFromPlatform()
      globalSearchFileFolder.expectToSeeFileCardFromVault()

      cy.logInTestCase('Clear search file by Go to Dashboard')
      cy.visit('/')

      cy.logInTestCase('Search folder')
      globalSearch.search(folderName)

      cy.logInTestCase('In All Tab')
      globalSearchFileFolder.expectToSeeFolderResultInAllPage()
      allTab.clickViewAll(folderName)

      cy.logInTestCase('Show search folders in Files tab')
      globalSearchFileFolder.expectToSeeFolderCardFrom(RootFolderType.community)
      globalSearchFileFolder.expectToSeeFolderCardFrom(RootFolderType.organization)
      globalSearchFileFolder.expectToSeeFolderCardFrom(RootFolderType.platform)
      globalSearchFileFolder.expectToSeeFolderCardFrom(RootFolderType.vault)
    })
  })
})
