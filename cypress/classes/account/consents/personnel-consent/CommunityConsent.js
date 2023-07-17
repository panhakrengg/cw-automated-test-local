import ConsentSettings from '../ConsentSettings'
import ConsentConstant from './ConsentConstant'

class CommunityConsent extends ConsentSettings {
  #communityYamlData

  constructor(communityYamlData) {
    super(communityYamlData)
    this.#communityYamlData = communityYamlData
  }

  verifyCommunityConsentItem() {
    super.accessConsentTab(ConsentConstant.consentTabs[0].name)
    super.verifyConsentItemElement(
      this.#communityYamlData.consent.name,
      ConsentConstant.communityDetailLabels,
      ConsentConstant.options
    )
  }
}

export default CommunityConsent
