import { recurse } from 'cypress-recurse'
import { PersonalType } from '../../constants/my-account/MyActivity'
import DateUtil from '../../utilities/DateUtil'
import BaseActivityLog from './base-activity-log/BaseActivityLog'

class CommunityConsentLog extends BaseActivityLog {
  copUserName = ''
  consentName = ''
  communityName = ''

  setData(copUserName, consentName, communityName) {
    this.copUserName = copUserName
    this.consentName = consentName
    this.communityName = communityName
  }

  textLogCreateCommunityConsent() {
    return `${this.copUserName} ${PersonalType.CREATED_CONSENT_FORM} ${this.consentName}`
  }
  textLogEnableCommunityConsent() {
    return `${this.copUserName} ${PersonalType.ENABLED_CONSENT_FORM} ${this.consentName}`
  }
  textLogGaveCommunityConsent() {
    return `${this.copUserName} ${PersonalType.GAVE_CONSENT_FOR} ${this.consentName}`
  }
  textLogRevokeCommunityConsent() {
    return `${this.copUserName} ${PersonalType.REVOKED_CONSENT_FOR} ${this.consentName}`
  }

  searchLogCreateConsentCommunity() {
    cy.log('create: ' + this.textLogCreateCommunityConsent())
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => $allLogs.text().includes(this.textLogCreateCommunityConsent()),
      this.configOption
    )
  }
  searchLogEnableConsentCommunity() {
    cy.log('enable: ' + this.textLogEnableCommunityConsent())
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => $allLogs.text().includes(this.textLogEnableCommunityConsent()),
      this.configOption
    )
  }
  searchLogGaveConsentCommunity() {
    cy.log('gave: ' + this.textLogGaveCommunityConsent())
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => $allLogs.text().includes(this.textLogGaveCommunityConsent()),
      this.configOption
    )
  }
  searchLogRevokeConsentCommunity() {
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => $allLogs.text().includes(this.textLogRevokeCommunityConsent()),
      this.configOption
    )
  }

  expectFoundCreateCommunityConsent() {
    this.searchLogCreateConsentCommunity()
    this.#expectCommunityConsentCard(
      PersonalType.CREATED_CONSENT_FORM,
      this.textLogCreateCommunityConsent()
    )
  }
  expectFoundEnableCommunityConsent() {
    this.searchLogEnableConsentCommunity()
    this.#expectCommunityConsentCard(
      PersonalType.ENABLED_CONSENT_FORM,
      this.textLogEnableCommunityConsent()
    )
  }
  expectFoundGaveCommunityConsent() {
    this.searchLogGaveConsentCommunity()
    this.#expectCommunityConsentCard(
      PersonalType.GAVE_CONSENT_FOR,
      this.textLogGaveCommunityConsent()
    )
  }
  expectFoundRevokeCommunityConsent() {
    this.searchLogRevokeConsentCommunity()
    this.#expectCommunityConsentCard(
      PersonalType.REVOKED_CONSENT_FOR,
      this.textLogRevokeCommunityConsent()
    )
  }

  #getCommunityCard(personalType) {
    return cy.get(`span:contains('${personalType}'):contains('${this.consentName}')`)
  }
  #expectCommunityConsentCard(personalType, cardTitle) {
    this.#getCommunityCard(personalType)
      .parents('.align-items-start')
      .invoke('text')
      .then((text) => {
        expect(text).to.include(cardTitle)
        expect(text).to.include(`Community: ${this.communityName}`)
      })
  }
}
export default CommunityConsentLog
