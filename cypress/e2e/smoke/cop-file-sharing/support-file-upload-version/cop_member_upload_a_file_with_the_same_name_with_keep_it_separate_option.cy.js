import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { SourceType } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'

describe(Epic.CoPFileSharing, () => {
  const fileSharingYamlStub = new FileSharingYamlStub()
  const fileSharingAssertion = new FileSharingAssertion()

  let fileName
  let fileSharingDetail

  before(() => {
    fileSharingYamlStub._getOCoPUploadFileVersionFile((oCoPUploadFileVersion) => {
      fileSharingDetail = new FileSharingDetail(oCoPUploadFileVersion.url)
      const communityFiles = oCoPUploadFileVersion.fileSharing.communityFiles
      fileName = communityFiles.uploadFiles.byOwner[1]
    })
  })

  context(Story.supportFileUploadVersion, () => {
    it('CoP Member upload a file with the same name of existing file and get validation', () => {
      Story.ticket('QA-1569')

      context('Prepare data', () => {
        MemberManagement._loginAsCoPMemberPayton()
        fileSharingDetail._visitFileSharingPage()
      })

      context('access to community folder and upload file', () => {
        fileSharingDetail._accessToCommunityFilesFolderDetails()
        fileSharingDetail._uploadFiles([fileName], SourceType.supportFileUploadVersion, (exist) => {
          if (exist) {
            cy.clickButtonByName(Field.KEEP_IT_SEPARATE)
            cy.getSwal2ButtonHolder().contains('button', Field.CLOSE).click()
          }
        })
      })

      context('access to community folder and upload file', () => {
        fileSharingAssertion._expectToSeeMultiFile(fileName.split('.docx')[0])
      })
    })
  })
})
