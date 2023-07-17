import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class MyProfileStub {
  #profileStatic = 'ProfileStatic'
  #invalidProfileStatic = 'InvalidProfileStatic'
  #communitySuite = 'CommunitySuite'
  #visibilityStatic = 'VisibilityStatic'
  #errorMessages = 'ErrorMessages'
  #emptyStateStatic = 'EmptyStateStatic'
  #sampleEditAddress = 'SampleEditAddress'
  #addConnection = 'AddConnection'
  #buttonStatic = 'ButtonStatic'
  #profileImageCanvas = 'ProfileImageCanvas'
  #settings = 'Settings'

  getSettings(dataCallback) {
    this.#getDataEntryYaml(this.#settings, dataCallback)
  }

  getProfileImageCanvas(dataCallback) {
    this.#getDataEntryYaml(this.#profileImageCanvas, dataCallback)
  }

  getButtonStatic(dataCallback) {
    this.#getDataEntryYaml(this.#buttonStatic, dataCallback)
  }

  getAddConnection(dataCallback) {
    this.#getDataEntryYaml(this.#addConnection, dataCallback)
  }

  getEmptyStateStatic(dataCallback) {
    this.#getDataEntryYaml(this.#emptyStateStatic, dataCallback)
  }

  getSampleEditAddress(dataCallback) {
    this.#getDataEntryYaml(this.#sampleEditAddress, dataCallback)
  }

  #getDataEntryYaml(baseYamlPath, dataCallback) {
    const pathUnderFixture = 'profile/sample-profile'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataCallback)
  }

  getProfileStatic(dataCallback) {
    this.#getDataEntryYaml(this.#profileStatic, dataCallback)
  }

  getInvalidProfileStatic(dataCallback) {
    this.#getDataEntryYaml(this.#invalidProfileStatic, dataCallback)
  }

  getCommunitySuite(dataCallback) {
    this.#getDataEntryYaml(this.#communitySuite, dataCallback)
  }

  getVisibilityStatic(dataCallback) {
    this.#getDataEntryYaml(this.#visibilityStatic, dataCallback)
  }

  getErrorMessages(dataCallback) {
    this.#getDataEntryYaml(this.#errorMessages, dataCallback)
  }
}

export default MyProfileStub
