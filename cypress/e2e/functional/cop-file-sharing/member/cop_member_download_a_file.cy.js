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

  let toDownloadFilesName = []
  let downloadedFilesName = []

  before(() => {
    fileSharingYamlStub._getSampleSuiteFileYaml((SampleSuiteFile) => {
      const fileSample100KBdoc = SampleSuiteFile.fileSample100KBdoc
      const fileSample100KBdocx = SampleSuiteFile.fileSample100KBdocx
      toDownloadFilesName = [fileSample100KBdoc, fileSample100KBdocx]
      downloadedFilesName = [fileSample100KBdocx]
    })
  })

  context(Story.manageFile, () => {
    it('Cop Member download a file', () => {
      Story.ticket('QA-206', ['CW-6955'])

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
      })

      context('Download files from quick access', () => {
        fileSharingDetail._accessToQuickAccessFolderDetails()
        fileSharingDetail._downloadFilesFromMostDownload(toDownloadFilesName)
      })

      context('Download files from favorite', () => {
        fileSharingDetail._accessToFavoriteFolderDetails()
        fileSharingDetail._downloadFiles(toDownloadFilesName)
      })

      context('Expect to see downloaded file', () => {
        fileSharingAssertion._expectToSeeDownloadedFiles(downloadedFilesName)
      })
    })
  })
})
