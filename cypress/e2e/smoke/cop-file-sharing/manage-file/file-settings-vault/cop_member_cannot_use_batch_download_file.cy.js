import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileFolderOperation from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/operation/FileFolderOperation'
import FileSharingDetail from '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.CoPFileSharing, () => {
  context(Story.fileSettingsVault, () => {
    const fileSharingDetail = new FileSharingDetail(
      '/web/ocop-file-sharing-for-functionality-vault'
    )
    const fileSharingYamlStub = new FileSharingYamlStub()
    const fileSharingAssertion = new FileSharingAssertion()
    let folderName
    let fileName
    before(() => {
      fileSharingYamlStub._getVaultFolderNotPreviewFile(($folder) => {
        folderName = $folder.name
      })
      new YamlHelper('cop-file-sharing/manage-file')
        .read()
        .its('SampleSuiteFile.file12text')
        .then((data) => {
          fileName = data
        })
    })
    it('CoP Member can not use feature batch download files on encrypted files', () => {
      Story.ticket('QA-1682')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToVaultFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
      fileSharingAssertion.expectDownloadNotExistAfterSelectAllFiles(
        fileSharingDetail.fileFolderOperation
      )
      new FileFolderOperation()._downloadFile(fileName)
      fileSharingAssertion._expectToSeeDownloadedFile(fileName)
    })
  })
})
