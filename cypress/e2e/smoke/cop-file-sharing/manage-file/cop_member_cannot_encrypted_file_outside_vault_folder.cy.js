import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { RootFolderType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  context(Story.fileSettingsVault, () => {
    const fileSharingDetail = new FileSharingDetail(
      '/web/ocop-file-sharing-for-functionality-vault'
    )
    const fileSharingAssertion = new FileSharingAssertion()
    const fileSharingYamlStub = new FileSharingYamlStub()
    let folderName

    before(() => {
      fileSharingYamlStub._getFolderForMarkAsFavoriteYaml(($folder) => {
        folderName = $folder.name
      })
    })
    it('CoP Member can not move encrypted file outside Vault folder', () => {
      Story.ticket('QA-1675')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(RootFolderType.vault)
      fileSharingDetail._selectAndClickMoveFile(folderName)
      fileSharingAssertion.expectNoFolderShowInMovePopup([
        RootFolderType.community,
        RootFolderType.platform,
        RootFolderType.organization,
      ])
    })
  })
})
