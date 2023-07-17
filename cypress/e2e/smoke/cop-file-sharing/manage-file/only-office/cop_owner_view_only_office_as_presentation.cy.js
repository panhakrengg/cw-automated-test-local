import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ManageFileSharing from '../../../../../classes/cop/collaboration/file-sharing/admin/ManageFileSharing'
import FileSharingAssertion from '../../../../../classes/cop/collaboration/file-sharing/assertion/FileSharingAssertion'
import { DropdownMenu } from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/FileSharingConstant'
import OnlyOffice from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/OnlyOffice'
import MemberManagement from '../../../../../classes/cop/collaboration/file-sharing/base-file-sharing/member-management/MemberManagement'
import FileSharingYamlStub from '../../../../../classes/cop/collaboration/file-sharing/stub/FileSharingYamlStub'

describe(Epic.CoPFileSharing, { retries: 1 }, () => {
  const fileSharingAssertion = new FileSharingAssertion()
  const officeFilePPT = '15-file-PPT.ppt'
  const officeFilePPTEncrypt = '15-file-PPT-encrypt.ppt'
  const officeFileODTEncrypt = '18-file-ODP_200kB-encrypt.odp'
  const officeFileODT = '18-file-ODP_200kB.odp'
  let manageFileSharing
  context(Story.manageFileOnlyOffice, () => {
    let cop

    before(() => {
      new FileSharingYamlStub()._getOCoPDisplayThumbnailAndPreviewFileYaml(
        (OCoPDisplayThumbnailAndPreviewFile) => {
          cop = OCoPDisplayThumbnailAndPreviewFile
        }
      )
      OnlyOffice.interceptDocServer()
    })

    function searchAndVerifyFile(file) {
      cy.logInTestCase('Visit file sharing and community detail')
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()

      cy.logInTestCase(`Search ${file} file`)
      manageFileSharing._searchFileOrFolderByName(`"${file}"`)

      cy.logInTestCase(`Verify view ${file} file`)
      manageFileSharing._viewFileViaThreedot(file)
      OnlyOffice.waitUntilRender()
      fileSharingAssertion.expectShowOnlyOfficeDoc(file)
    }

    function searchAndVerifyEncryptFile(file) {
      manageFileSharing._visitFileSharingPage()
      manageFileSharing._accessToCommunityFilesFolderDetails()
      cy.logInTestCase(`Search ${file} file`)
      manageFileSharing._searchFileOrFolderByName(`"${file}"`)

      cy.logInTestCase('Verify threedot for encrypted file')
      fileSharingAssertion._expectHaveThreedotOptions(file, [DropdownMenu.download])
      fileSharingAssertion._expectEncryptedFileNotHaveThreedotOptions(file, [
        DropdownMenu.view,
        DropdownMenu.versions,
      ])
    }

    it('CoP Owner view an office file as presentation', () => {
      Story.ticket('QA-1537')
      manageFileSharing = new ManageFileSharing(cop.url)
      MemberManagement._loginAsCoPMemberElder50()
      searchAndVerifyFile(officeFilePPT)
      searchAndVerifyEncryptFile(officeFilePPTEncrypt)
      searchAndVerifyFile(officeFileODT)
      searchAndVerifyEncryptFile(officeFileODTEncrypt)
    })
  })
})
