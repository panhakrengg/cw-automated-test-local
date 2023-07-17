import { RootFolderType } from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingYamlStub = new FileSharingYamlStub()
  let folderForCopyLink

  before(() => {
    fileSharingYamlStub._getOCoPFileSharingForFunctionalityVault(
      (OCoPFileSharingForFunctionalityVault) => {
        const vault = OCoPFileSharingForFunctionalityVault.fileSharing.communityFiles.vault
        folderForCopyLink = vault.folderForCopyLink.name
      }
    )
  })

  context(Story.fileSettingsVault, () => {
    it('CoP Member copy link a file encrypted in a CoP then others cannot open link file', () => {
      Story.ticket('QA-1674')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(RootFolderType.vault)
      fileSharingDetail.clickCopyLinkFolder(folderForCopyLink)

      MemberManagement._loginAsOrgMemberLitzy5()
      fileSharingDetail.pasteLink()
      cy.thisLinkIsNotAvailable()

      MemberManagement._loginAsOrgMemberElucy()
      fileSharingDetail.pasteLink()
      cy.thisLinkIsNotAvailable()
    })
  })
})
