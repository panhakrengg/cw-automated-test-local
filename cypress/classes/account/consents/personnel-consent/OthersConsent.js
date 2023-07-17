import ConsentSettings from '../ConsentSettings'
import ConsentConstant from './ConsentConstant'

class OthersConsent extends ConsentSettings {
  #otherYamlData

  constructor(otherYamlData) {
    super(otherYamlData)
    this.#otherYamlData = otherYamlData
  }

  verifyOthersConsentItem() {
    const cloneOptions = Cypress._.cloneDeep(ConsentConstant.options)
    cloneOptions.splice(1, 1)
    super.accessConsentTab(ConsentConstant.consentTabs[2].name)
    super.verifyConsentItemElement(
      this.#otherYamlData.consent.name,
      ConsentConstant.otherDetailLabels,
      cloneOptions,
      true
    )
  }
}

export default OthersConsent
