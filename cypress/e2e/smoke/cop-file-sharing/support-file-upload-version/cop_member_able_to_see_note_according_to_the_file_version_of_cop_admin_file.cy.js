import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import {
  DropdownMenu,
  SourceType,
} from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'

describe(Epic.CoPFileSharing, () => {
  const fileSharingYamlStub = new FileSharingYamlStub()
  const fileSharingAssertion = new FileSharingAssertion()

  let fileName
  let fileSharingDetail
  let fileVersions

  before(() => {
    fileSharingYamlStub._getOCoPUploadFileVersionFile((oCoPUploadFileVersion) => {
      fileSharingDetail = new FileSharingDetail(oCoPUploadFileVersion.url)
      const communityFiles = oCoPUploadFileVersion.fileSharing.communityFiles
      fileName = communityFiles.uploadFiles.byAdminJson[0]
    })
    fileVersions = [{ name: 'Version 2.0', options: [DropdownMenu.view] }]
  })

  context(Story.supportFileUploadVersion, () => {
    it('CoP Member able to see note according to the file version of CoP Admin file', () => {
      Story.ticket('QA-1578')

      cy.logInTestCase('Prepare data')
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()

      cy.logInTestCase('access to community folder and upload file')
      fileSharingDetail._accessToCommunityFilesFolderDetails()

      cy.logInTestCase('expect to see file version note detail')
      fileSharingAssertion.expectToSeeFilVersionThreedotOption(
        fileSharingDetail.fileFolderOperation,
        fileName,
        fileVersions[0]
      )
    })
  })
})
