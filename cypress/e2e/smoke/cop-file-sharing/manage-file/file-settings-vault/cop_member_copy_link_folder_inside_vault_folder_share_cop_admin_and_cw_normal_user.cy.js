import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { RootFolderType } from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import ResourceDisplay from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/ResourceDisplay'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPFileSharing, { retries: 1 }, () => {
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-for-functionality-vault')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()
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
    it('CoP Member copy link folder inside Vault folder and share to CoP Admin and Cw Normal User', () => {
      Story.ticket('QA-1650')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(RootFolderType.vault)
      fileSharingDetail.clickCopyLinkFolder(folderForCopyLink)

      MemberManagement._loginAsAdmin()
      fileSharingDetail.pasteLink()
      new ResourceDisplay().clickViewFolder()
      fileSharingAssertion._expectToSeeMultiFile(file8docx)

      MemberManagement._loginAsOrgMemberElucy()
      fileSharingDetail.pasteLink()
      cy.thisLinkIsNotAvailable()
    })
  })
})
