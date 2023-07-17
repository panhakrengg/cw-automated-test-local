import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { SourceType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPFileSharing, () => {
  const fileSharingYamlStub = new FileSharingYamlStub()
  const fileSharingAssertion = new FileSharingAssertion()

  let fileName
  let differenceFileTypeName
  let folderName
  let fileSharingDetail

  before(() => {
    fileSharingYamlStub._getOCoPUploadFileVersionFile((oCoPUploadFileVersion) => {
      fileSharingDetail = new FileSharingDetail(oCoPUploadFileVersion.url)
      const communityFiles = oCoPUploadFileVersion.fileSharing.communityFiles
      folderName = communityFiles.coPMemberFileVersion.name
      const files = communityFiles.coPMemberFileVersion.uploadFiles
      fileName = files.byMemberPayton[8]
      differenceFileTypeName = files.byMemberPayton[6]
    })
  })

  context(Story.supportFileUploadVersion, () => {
    it('CoP Member upload a different file type get warning message', () => {
      Story.ticket('QA-1574')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
      })

      context('access to community folder and upload file', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)
        fileSharingDetail.uploadFileIfNotExist(fileName, SourceType.supportFileUploadVersion)
      })

      context('upload a difference file type', () => {
        fileSharingDetail.uploadFileNewVersion(
          fileName,
          differenceFileTypeName,
          SourceType.supportFileUploadVersion,
          true,
          (isDifferenceType) => {
            if (isDifferenceType) {
              fileSharingAssertion.expectToSeeDifferenceFileTypePopup()
            }
          }
        )
      })
    })
  })
})
