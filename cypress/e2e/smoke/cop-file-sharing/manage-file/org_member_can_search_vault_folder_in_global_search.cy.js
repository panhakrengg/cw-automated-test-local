import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  context(Story.fileSettingsVault, () => {
    const fileSharingYamlStub = new FileSharingYamlStub()
    const globalSearch = new GlobalSearch()
    let folderName

    before(() => {
      fileSharingYamlStub._getFolderForGlobalSearch(($folder) => {
        folderName = $folder.name
      })
    })
    it('Org Member is not able to see a Vault folder via Global search even CoP is related to the same Organization', () => {
      Story.ticket('QA-1652')
      MemberManagement._loginAsOrgMemberElucy()
      globalSearch.search(folderName)
      globalSearch.expectedNotFoundFileFolderInGlobalSearch(folderName)
      globalSearch.clickFileTab()
      globalSearch.expectedNotFoundFileFolderInGlobalSearch(folderName)
    })
  })
})
