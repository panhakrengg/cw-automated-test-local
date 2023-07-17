import Environment from '../../../../base/Environment'
import AllTab from '../../../../global-search/AllTab'
import { FilesButtonName } from '../../../../global-search/base-global-search/GlobalSearchConstant'
import FileTabs from '../../../../global-search/FilesTab'
import FileSharingAssertion from '../assertion/FileSharingAssertion'
import { RootFolderType } from '../base-file-sharing/FileSharingConstant'

class GlobalSearchFileAndFolder {
  #baseYamlPath
  #communityYamlPath
  #copCode
  #copName
  #fileSharingYamlPath
  #mainFolderBaseYamlPath
  #mainFolderBreadcrumb
  #mainFolderLocation
  #mainFolderName
  #organizationYamlPath
  #platformYamlPath
  #vaultYamlPath
  #fileButtonName = FilesButtonName.viewFile
  #filesTab = new FileTabs('/web/ocop-file-sharing-for-functionality-global-search')

  constructor(baseYamlPath, copCodeFile) {
    this.#baseYamlPath = baseYamlPath
    this.#copCode = copCodeFile
  }

  setFileFolderBaseYamlPath() {
    this.#copName = this.#baseYamlPath.name
    this.#fileSharingYamlPath = this.#baseYamlPath.fileSharing

    this.#communityYamlPath = this.#fileSharingYamlPath.communityFiles
    this.#organizationYamlPath = this.#fileSharingYamlPath.organization
    this.#platformYamlPath = this.#fileSharingYamlPath.platform
    this.#vaultYamlPath = this.#communityYamlPath.vault
  }

  #getFileName(baseFolderPath, fileIndex = 0) {
    return baseFolderPath.uploadFiles.byOwner[fileIndex]
  }
  #setMainFolder(mainFolder) {
    this.#mainFolderName = mainFolder
    this.#mainFolderLocation = mainFolder

    switch (mainFolder) {
      case RootFolderType.community:
        this.#mainFolderBaseYamlPath = this.#communityYamlPath
        this.#mainFolderBreadcrumb = RootFolderType.communityFile
        break
      case RootFolderType.organization:
        this.#mainFolderBaseYamlPath = this.#organizationYamlPath
        this.#mainFolderBreadcrumb = mainFolder
        break
      case RootFolderType.platform:
        this.#mainFolderBaseYamlPath = this.#platformYamlPath
        this.#mainFolderBreadcrumb = mainFolder
        break
      case RootFolderType.vault:
        this.#fileButtonName = FilesButtonName.downloadFile
        this.#mainFolderBaseYamlPath = this.#vaultYamlPath
        this.#mainFolderBreadcrumb = `${RootFolderType.communityFile}/${RootFolderType.vault}`
        this.#mainFolderLocation = `${RootFolderType.community} / ${mainFolder}`
        break
      default:
        break
    }
  }
  #getFolderYamlPath() {
    return this.#mainFolderBaseYamlPath[`${this.#copCode}FolderGlobalSearch${this.#mainFolderName}`]
  }
  #getFolderName() {
    return this.#getFolderYamlPath().name
  }
  #getFolderLocation() {
    return [this.#copName, this.#mainFolderLocation]
  }

  #getSubFolderLocation() {
    return [this.#copName, this.#mainFolderLocation, this.#getFolderName()]
  }
  #getSubFolderYamlPath() {
    return this.#mainFolderBaseYamlPath[`${this.#copCode}FolderGlobalSearch${this.#mainFolderName}`]
      .subFolder[`${this.#copCode}SubFolderGlobalSearch${this.#mainFolderName}`]
  }
  #getSubFolderName() {
    return this.#getSubFolderYamlPath().name
  }
  #getSubFolderId() {
    return this.#getSubFolderYamlPath().id[new Environment().getEnvPrefix()]
  }
  #getBreadcrumb() {
    return [this.#mainFolderBreadcrumb, this.#getFolderName(), this.#getSubFolderName()]
  }

  expectToSeeFilesResultInAllPage() {
    const allTab = new AllTab()
    const fileName = this.#fileSharingYamlPath.searchFile

    allTab.expectShowSearchResultLabel(fileName, 4)
    allTab.expectFoundFilesFolders(fileName, this.#copName, 'File')
  }

  expectToSeeFolderResultInAllPage() {
    const allTab = new AllTab()
    const folderName = this.#fileSharingYamlPath.searchFolder

    allTab.expectShowSearchResultLabel(folderName, 4)
    allTab.expectFoundFilesFolders(folderName, this.#copName, FilesButtonName.viewFolder)
  }

  expectToSeeFileFromFolderViaLocation(mainFolder) {
    this.#setMainFolder(mainFolder)
    this.#filesTab.expectFileFolderCardByLocation(
      this.#getFolderLocation(),
      this.#getFileName(this.#mainFolderBaseYamlPath),
      this.#fileButtonName
    )
  }

  expectToSeeFileFromFolderViaName(mainFolder) {
    this.#setMainFolder(mainFolder)
    this.#filesTab.expectFileFolderCard(
      this.#getFileName(this.#mainFolderBaseYamlPath),
      this.#getFolderLocation(),
      this.#fileButtonName
    )
  }

  expectToSeeFileCardFromCommunity() {
    this.expectToSeeFileFromFolderViaName(RootFolderType.community)
  }

  expectToSeeFileCardFromOrganization() {
    this.expectToSeeFileFromFolderViaName(RootFolderType.organization)
  }

  expectToSeeFileCardFromPlatform() {
    this.expectToSeeFileFromFolderViaName(RootFolderType.platform)
  }

  expectToSeeFileCardFromVault() {
    this.expectToSeeFileFromFolderViaName(RootFolderType.vault)
  }

  expectToSeeSubFolderCardFrom(mainFolder) {
    this.#setMainFolder(mainFolder)
    this.#filesTab.expectFileFolderCard(
      this.#getSubFolderName(),
      this.#getSubFolderLocation(),
      FilesButtonName.viewFolder
    )
  }

  expectToSeeFolderCardFrom(mainFolder) {
    this.#setMainFolder(mainFolder)
    this.#filesTab.expectFileFolderCard(
      this.#getFolderName(),
      this.#getFolderLocation(),
      FilesButtonName.viewFolder
    )
  }
  clickViewFolderThenSeeBreadcrumb() {
    this.#filesTab.clickViewFolder(this.#getSubFolderId())
    new FileSharingAssertion()._expectToSeeBreadcrumb(this.#getBreadcrumb())
  }
}

export default GlobalSearchFileAndFolder
