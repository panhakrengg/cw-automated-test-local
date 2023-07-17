import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import GlobalSearchFileAndFolder from '../../../../classes/cop/collaboration/file-sharing/global-search/GlobalSearchFileAndFolder'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const globalSearch = new GlobalSearch()
  const oCoPCodeFile = '717273'
  let folderName
  let globalSearchFolder

  before(() => {
    new FileSharingYamlStub()._getOCoPGlobalSearch((oCoPGlobalSearch) => {
      folderName = oCoPGlobalSearch.fileSharing.searchSubFolder
      globalSearchFolder = new GlobalSearchFileAndFolder(oCoPGlobalSearch, oCoPCodeFile)
    })
  })

  context(Story.globalSearchFileAndFolder, () => {
    it('CoP Member search folders from Organization CoP in Global Search then view the folder in CoP', () => {
      Story.ticket('QA-1709')

      globalSearchFolder.setFileFolderBaseYamlPath()

      cy.logInTestCase('Search folder > Files tab')
      MemberManagement._loginAsCoPMemberElder50()
      globalSearch.search(folderName)
      globalSearch.clickFileTab()

      cy.logInTestCase('Show search folders in Files tab')
      globalSearchFolder.expectToSeeSubFolderCardFrom(RootFolderType.community)
      globalSearchFolder.expectToSeeSubFolderCardFrom(RootFolderType.organization)
      globalSearchFolder.expectToSeeSubFolderCardFrom(RootFolderType.platform)
      globalSearchFolder.expectToSeeSubFolderCardFrom(RootFolderType.vault)

      cy.logInTestCase('Click view folder button')
      globalSearchFolder.clickViewFolderThenSeeBreadcrumb(RootFolderType.community)
      globalSearchFolder.clickViewFolderThenSeeBreadcrumb(RootFolderType.vault)
      globalSearchFolder.clickViewFolderThenSeeBreadcrumb(RootFolderType.organization)
      globalSearchFolder.clickViewFolderThenSeeBreadcrumb(RootFolderType.platform)
    })
  })
})
