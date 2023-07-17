import EntryYamlManagement from '../../../utilities/EntryYamlManagement'

export default class OrgStructureYamlStub {
  #newOrg = 'NewOrg'
  #newCompany = 'NewCompany'
  #orgToBeModify = 'OrgToBeModify'
  #modifyOrgTo = 'ModifyOrgTo'
  #existingOrg = 'ExistingOrg'
  #fireCloudZone = 'FireCloudZone'

  #getDataEntryYaml(baseYamlPath, dataCallback) {
    const pathUnderFixture = 'org-structure/org-info'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataCallback)
  }

  getNewOrg(dataCallback) {
    this.#getDataEntryYaml(this.#newOrg, dataCallback)
  }

  getNewCompany(dataCallback) {
    this.#getDataEntryYaml(this.#newCompany, dataCallback)
  }

  getOrgToBeModify(dataCallback) {
    this.#getDataEntryYaml(this.#orgToBeModify, dataCallback)
  }

  getModifyOrgTo(dataCallback) {
    this.#getDataEntryYaml(this.#modifyOrgTo, dataCallback)
  }

  getExistingOrg(dataCallback) {
    this.#getDataEntryYaml(this.#existingOrg, dataCallback)
  }

  getFireCloudZone(dataCallback) {
    this.#getDataEntryYaml(this.#fireCloudZone, dataCallback)
  }
}
