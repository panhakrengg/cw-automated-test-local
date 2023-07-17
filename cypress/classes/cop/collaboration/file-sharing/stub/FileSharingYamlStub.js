import EntryYamlManagement from '../../../../utilities/EntryYamlManagement'

class FileSharingYamlStub {
  #previewSuiteFileYamlPath = 'PreviewSuiteFile.files'
  #SampleSuiteFileYamlPath = 'SampleSuiteFile'
  #baseCommunityFilesYamlPath = 'ManageCommunitySuite.OCoPManageFile.fileSharing.communityFiles'
  #baseOCoPManageFileYamlPath = 'ManageCommunitySuite.OCoPManageFile'
  #baseOCoPUploadFileVersionYamlPath = 'ManageCommunitySuite.oCoPUploadFileVersion'
  #OCoPDisplayThumbnailAndPreviewFile = 'ManageCommunitySuite.OCoPDisplayThumbnailAndPreviewFile'
  #OCoPGlobalSearch = 'ManageCommunitySuite.OCoPGlobalSearch'
  #TCoPHackettLebsack = 'ManageCommunitySuite.tCoPHackettLebsack'
  #vaultEnabledCop = 'ManageCommunitySuite.oCoPVaultEnableRecycleBin'
  #aPCoPFireCloudZoneInternational = 'ManageCommunitySuite.aPCoPFireCloudZoneInternational'
  #OCoPFileSharingForFunctionalityVault =
    'ManageCommunitySuite.OCoPFileSharingForFunctionalityVault'
  #vaultFileAndFolderDetails =
    'ManageCommunitySuite.OCoPFileSharingForFunctionalityVault.fileSharing.communityFiles.vault.FileAndFolderDetails'
  #vaultFolderNotPreviewFile =
    'ManageCommunitySuite.OCoPFileSharingForFunctionalityVault.fileSharing.communityFiles.vault.folderNotForPreviewFiles'

  #getDataEntryYaml(baseYamlPath, dataEntryCallback) {
    const pathUnderFixture = 'cop-file-sharing/manage-file'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataEntryCallback)
  }

  _getCommunityFileYaml(dataEntryCallback) {
    this.#getDataEntryYaml(this.#baseCommunityFilesYamlPath, dataEntryCallback)
  }

  _getPreviewSuiteFileYaml(dataEntryCallback) {
    this.#getDataEntryYaml(this.#previewSuiteFileYamlPath, dataEntryCallback)
  }

  _getSampleSuiteFileYaml(dataEntryCallback) {
    this.#getDataEntryYaml(this.#SampleSuiteFileYamlPath, dataEntryCallback)
  }

  _getOCoPManageFileYaml(dataEntryCallback) {
    this.#getDataEntryYaml(this.#baseOCoPManageFileYamlPath, dataEntryCallback)
  }

  _getOCoPUploadFileVersionFile(dataEntryCallback) {
    this.#getDataEntryYaml(this.#baseOCoPUploadFileVersionYamlPath, dataEntryCallback)
  }

  _getExistingFileYaml(callback = () => {}) {
    this._getCommunityFileYaml((communityFiles) => {
      return callback(communityFiles.existingFolder)
    })
  }

  _getFolderForSearchFunctionality(callback = () => {}) {
    this._getExistingFileYaml((existingFolder) => {
      return callback(existingFolder.folderForSearchFunctionality)
    })
  }

  _getFolderForUploadFile(callback = () => {}) {
    this._getExistingFileYaml((existingFolder) => {
      return callback(existingFolder.folderForUploadAFile)
    })
  }

  _getFolderForUploadMultipleFiles(callback = () => {}) {
    this._getExistingFileYaml((existingFolder) => {
      return callback(existingFolder.folderForUploadMultipleFiles)
    })
  }

  _getFolderForDownloadYaml(callback = () => {}) {
    this._getExistingFileYaml((existingFolder) => {
      return callback(existingFolder.folderForDownload)
    })
  }

  _getFolderForGlobalSearch(callback = () => {}) {
    this._getExistingFileYaml((existingFolder) => {
      return callback(existingFolder.folderForGlobalSearch)
    })
  }

  _getFolderForMarkAsFavoriteYaml(callback = () => {}) {
    this._getExistingFileYaml((existingFolder) => {
      return callback(existingFolder.folderForMarkAsFavorite)
    })
  }

  _getOCoPDisplayThumbnailAndPreviewFileYaml(dataEntryCallback) {
    this.#getDataEntryYaml(this.#OCoPDisplayThumbnailAndPreviewFile, dataEntryCallback)
  }

  _getOCoPGlobalSearch(dataEntryCallback) {
    this.#getDataEntryYaml(this.#OCoPGlobalSearch, dataEntryCallback)
  }

  _getTCoPHackettLebsack(dataEntryCallback) {
    this.#getDataEntryYaml(this.#TCoPHackettLebsack, dataEntryCallback)
  }

  _getVaultEnabledCop(callback) {
    this.#getDataEntryYaml(this.#vaultEnabledCop, callback)
  }

  _getAPCoPFireCloudZoneInternational(dataEntryCallback) {
    this.#getDataEntryYaml(this.#aPCoPFireCloudZoneInternational, dataEntryCallback)
  }

  _getOCoPFileSharingForFunctionalityVault(dataEntryCallback) {
    this.#getDataEntryYaml(this.#OCoPFileSharingForFunctionalityVault, dataEntryCallback)
  }

  _getVaultFileAndFolderDetails(dataEntryCallback) {
    this.#getDataEntryYaml(this.#vaultFileAndFolderDetails, dataEntryCallback)
  }

  _getVaultFolderNotPreviewFile(dataEntryCallback) {
    this.#getDataEntryYaml(this.#vaultFolderNotPreviewFile, dataEntryCallback)
  }

}

export default FileSharingYamlStub
