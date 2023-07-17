import Epic from '../../../../../classes/Epic'
import FileSharingAssertion from
    '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import FileSharingDetail from
    '../../../../../classes/cop/collaboration/file-sharing/member/FileSharingDetail'
import MemberManagement from
    '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import Story from '../../../../../classes/Story'
import { DropdownMenu } from
    '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'

describe(Epic.CoPFileSharing, () => {
  const fileSharingAssertion = new FileSharingAssertion()

  context(Story.fileSettingsShareToFolders, () => {
    const fileName = '797973filesharing.docx'
    const folderName = '797973foldersharing'
    it('Org Member able to see a file/folder in organization from OCoP via CoP url', () => {
      Story.ticket('QA-1541')
      const fileSharingDetail = new FileSharingDetail(
        '/web/ocop-for-functionality-access-share-folder'
      )
      MemberManagement._loginAsCoPMemberPayton()
      fileSharingDetail._visitFileSharingPage()
      fileSharingDetail._accessToOrganizationFolderDetails()
      fileSharingAssertion._expectToSeeFilesOrFolders([folderName, fileName])
      fileSharingAssertion._expectHaveThreedotOptions(folderName, [
        DropdownMenu.copyLink,
        DropdownMenu.rename,
        DropdownMenu.markAsFavorite,
        DropdownMenu.details
      ])
      fileSharingAssertion._expectHaveThreedotOptions(fileName, [
        DropdownMenu.view,
        DropdownMenu.download,
        DropdownMenu.copyLink,
        DropdownMenu.rename,
        DropdownMenu.markAsFavorite,
        DropdownMenu.details,
        DropdownMenu.versions
      ])
      fileSharingAssertion.expectToSeeFilVersionThreedotOption(
        fileSharingDetail.fileFolderOperation,
        fileName,
        {
          name: 'Version 1.0',
          options: ['Download (20 KB)', DropdownMenu.view]
        }
      )
      fileSharingAssertion.expectNotToSeeFilVersionThreedotOption(
        fileSharingDetail.fileFolderOperation,
        fileName,
        {
          name: 'Version 1.0',
          options: [
            DropdownMenu.addNote,
            DropdownMenu.makeDefault,
            DropdownMenu.deleteVersion
          ]
        }
      )
    })
  })
})
