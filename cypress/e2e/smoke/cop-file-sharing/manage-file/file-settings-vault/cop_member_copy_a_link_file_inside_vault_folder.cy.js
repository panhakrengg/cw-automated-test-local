import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { RootFolderType } from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import ResourceDisplay from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/ResourceDisplay'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()
  const resourceDisplay = new ResourceDisplay()
  let folderForCopyLink, file8docx
  before(() => {
    fileSharingYamlStub._getOCoPFileSharingForFunctionalityVault(
      (OCoPFileSharingForFunctionalityVault) => {
        const vault = OCoPFileSharingForFunctionalityVault.fileSharing.communityFiles.vault
        folderForCopyLink = vault.folderForCopyLink.name
        file8docx = vault.folderForCopyLink.uploadFiles.byMemberPayton[0]
      }
    )
  })

  context(Story.fileSettingsVault, () => {
    it('CoP Member copy a link file inside Vault folder', () => {
      Story.ticket('QA-1660')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(RootFolderType.vault)
      fileSharingDetail._accessToFolderDetailsViaFolderName(folderForCopyLink)
      fileSharingDetail.clickCopyLinkFile(file8docx)

      MemberManagement._loginAsAdmin()
      fileSharingDetail.pasteLink()
      resourceDisplay.expectDisplayAsFile(file8docx, '34 KB')
      resourceDisplay.openFileLocation()
      fileSharingAssertion._expectToSeeMultiFile(file8docx)
      let folderBreadCrumb = [RootFolderType.communityFile, RootFolderType.vault, folderForCopyLink]
      fileSharingAssertion._expectToSeeBreadcrumb(folderBreadCrumb)
    })
  })
})
