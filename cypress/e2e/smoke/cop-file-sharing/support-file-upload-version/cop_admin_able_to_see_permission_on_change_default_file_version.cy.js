import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import FileSharingAssertion from '../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { DropdownMenu } from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import MemberManagement from '../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingDetail from '../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import FileSharingYamlStub from '../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'

describe(Epic.CoPFileSharing, () => {
  const fileSharingYamlStub = new FileSharingYamlStub()
  const fileSharingAssertion = new FileSharingAssertion()

  let fileName
  let folderName
  let fileSharingDetail
  let fileVersions

  before(() => {
    fileSharingYamlStub._getOCoPUploadFileVersionFile((oCoPUploadFileVersion) => {
      fileSharingDetail = new FileSharingDetail(oCoPUploadFileVersion.url)
      const communityFiles = oCoPUploadFileVersion.fileSharing.communityFiles
      folderName = communityFiles.coPMemberFileVersion.name
      fileName = communityFiles.coPMemberFileVersion.uploadFiles.byMemberEldred[1]
    })
    fileVersions = [
      {
        name: 'Version 1.0',
        options: [
          DropdownMenu.download,
          DropdownMenu.view,
          DropdownMenu.addNote,
          DropdownMenu.makeDefault,
          DropdownMenu.deleteVersion,
        ],
      },
    ]
  })

  context(Story.supportFileUploadVersion, () => {
    it('CoP Admin able to see permission on change default file version', () => {
      Story.ticket('QA-1781')

      cy.logInTestCase('Prepare data')
      MemberManagement._loginAsAdmin()
      fileSharingDetail._visitFileSharingPage()

      cy.logInTestCase('access to community folder then access to target folder')
      fileSharingDetail._accessToCommunityFilesFolderDetails()
      fileSharingDetail._accessToFolderDetailsViaFolderName(folderName)

      cy.logInTestCase('expect to see available options')
      fileSharingAssertion.expectToSeeNoteThreedotOption(
        fileSharingDetail.fileFolderOperation,
        fileName,
        fileVersions[0]
      )
    })
  })
})
