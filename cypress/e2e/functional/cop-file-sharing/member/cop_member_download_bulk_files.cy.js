import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingDetail = new FileSharingDetail('/web/ocop-file-sharing-manage-file')
  const fileSharingAssertion = new FileSharingAssertion()
  const fileSharingYamlStub = new FileSharingYamlStub()

  let folderName
  let subFolderName
  let filesToDownload = []

  before(() => {
    fileSharingYamlStub._getFolderForDownloadYaml((folderForDownload) => {
      folderName = folderForDownload.name
      subFolderName = folderForDownload.subFolder.wordOffice.name
      filesToDownload = folderForDownload.subFolder.wordOffice.uploadFiles.byMemberPayton.files
    })
  })

  context(Story.manageFile, () => {
    it('Cop Member download bulk files', () => {
      Story.ticket('QA-207')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
      })

      context('Access to folder to download bulk files', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        fileSharingDetail._accessToFolderDetailsViaFolderName(subFolderName)
      })

      context('Download bulk files', () => {
        fileSharingDetail._downloadBulkFiles(filesToDownload)
      })

      context('Expect to see downloaded bulk files', () => {
        fileSharingAssertion._expectToSeeDownloadedBulkAttachment()
      })
    })
  })
})
