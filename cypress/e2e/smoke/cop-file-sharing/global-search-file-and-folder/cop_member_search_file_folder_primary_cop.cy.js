import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import GlobalSearchFileAndFolder from '../../../../classes/cop/collaboration/file-sharing/global-search/GlobalSearchFileAndFolder'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const globalSearch = new GlobalSearch()
  let fileName
  let globalSearchFile

  before(() => {
    new FileSharingYamlStub()._getAPCoPFireCloudZoneInternational(
      (aPCoPFireCloudZoneInternational) => {
        fileName = aPCoPFireCloudZoneInternational.fileSharing.searchFile
        globalSearchFile = new GlobalSearchFileAndFolder(aPCoPFireCloudZoneInternational)
      }
    )
  })

  context(Story.globalSearchFileAndFolder, () => {
    it('CoP Member search file and folder in Primary CoP', () => {
      Story.ticket('QA-1544')

      context('Search file by CoP Member', () => {
        globalSearchFile.setFileFolderBaseYamlPath()
        MemberManagement._loginAsCoPMemberPayton()
        globalSearch.search(fileName)
        globalSearch.clickFileTab()

        globalSearchFile.expectToSeeFileFromFolderViaLocation(RootFolderType.community)
        globalSearchFile.expectToSeeFileFromFolderViaLocation(RootFolderType.organization)
        globalSearchFile.expectToSeeFileFromFolderViaLocation(RootFolderType.platform)
      })

      context('Search file by CW User', () => {
        MemberManagement._loginAsOrgMemberJason()
        globalSearch.search(fileName)

        cy.showEmptySearchResult(fileName)
      })

      context('Search file by Org Member', () => {
        MemberManagement._loginAsOrgMemberElucy()
        globalSearch.search(fileName)

        cy.showEmptySearchResult(fileName)
      })
    })
  })
})
