import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import AllTab from '../../../../classes/global-search/AllTab'
import { FilesButtonName } from '../../../../classes/global-search/base-global-search/GlobalSearchConstant'
import FileTabs from '../../../../classes/global-search/FilesTab'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const allTab = new AllTab()
  const globalSearch = new GlobalSearch()
  let fileName, copName, fileLocation

  before(() => {
    new FileSharingYamlStub()._getOCoPManageFileYaml((OCoPManageFile) => {
      const folderYamlPath =
        OCoPManageFile.fileSharing.communityFiles.existingFolder.folderForSearchFunctionality
      fileName = folderYamlPath.uploadFiles.byAdminJson.files[3]
      copName = OCoPManageFile.label
      fileLocation = [copName, RootFolderType.community, folderYamlPath.name]
    })
  })

  context(Story.globalSearchFileAndFolder, () => {
    it('CoP Admin search an exact file name that includes special character dash', () => {
      Story.ticket('QA-1708')

      MemberManagement._loginAsOrgMemberJason()
      globalSearch.search(`"${fileName}"`)

      cy.logInTestCase('In All Tab')
      allTab.expectShowSearchResultLabel(`"${fileName}"`, 1)
      allTab.expectFoundFilesFolders(fileName, copName, FilesButtonName.viewFile, 1, fileLocation)
      globalSearch.clickFileTab()

      cy.logInTestCase('In Files Tab')
      new FileTabs().expectFileFolderCard(fileName, fileLocation, FilesButtonName.viewFile)
    })
  })
})
