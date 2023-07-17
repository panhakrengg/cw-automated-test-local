import ManageFileSharing from '../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const communityLabel = RootFolderType.community
  const fileSharingAssertion = new FileSharingAssertion()
  const manageFileSharing = new ManageFileSharing(
    '/web/ocop-file-sharing-for-functionality-global-search'
  )
  let fileName, communityFileName, organizationFileName, platformFileName

  before(() => {
    new FileSharingYamlStub()._getOCoPGlobalSearch((oCoPGlobalSearch) => {
      fileName = oCoPGlobalSearch.fileSharing.searchFile
      communityFileName = oCoPGlobalSearch.fileSharing.communityFiles.uploadFiles.byOwner[0]
      organizationFileName = oCoPGlobalSearch.fileSharing.organization.uploadFiles.byOwner[0]
      platformFileName = oCoPGlobalSearch.fileSharing.platform.uploadFiles.byOwner[0]
    })
  })
  context(Story.globalSearchFileAndFolder, () => {
    it('Org Member search a share files/folder Organization CoP via CoP URL', () => {
      Story.ticket('QA-1711')

      MemberManagement._loginAsCoPMemberPayton()
      manageFileSharing._visitFileSharingPage()

      manageFileSharing._searchFileOrFolderByName(fileName, () => {
        fileSharingAssertion._expectToSeeFileOrFolder(organizationFileName)
        fileSharingAssertion._expectToSeeFileOrFolder(platformFileName)
        fileSharingAssertion._expectNotToSeeFileOrFolder(communityFileName)
      })

      manageFileSharing._searchFileOrFolderByName(communityLabel, () => {
        fileSharingAssertion._expectToSeeEmptyState(communityLabel)
      })
    })
  })
})
