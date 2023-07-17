import { recurse } from 'cypress-recurse'
import { PersonalType } from '../../constants/my-account/MyActivity'
import BaseActivityLog from './base-activity-log/BaseActivityLog'

class OrganizationConsentLog extends BaseActivityLog {
  userName = ''
  consentName = ''
  organizationName = ''

  setData(copUserName, consentName, communityName) {
    this.userName = copUserName
    this.consentName = consentName
    this.organizationName = communityName
  }

  textLogCreatePredefined() {
    return `${this.userName} ${PersonalType.CREATED_PREDEFINED_FORM} ${this.consentName}`
  }
  textLogDeletePredefine() {
    return `${this.userName} ${PersonalType.DELETE_PREDEFINED_FORM} ${this.consentName}`
  }
  textLogDeprecatePredefined() {
    return `${this.userName} ${PersonalType.DEPRECATED_PREDEFINED_FORM} ${this.consentName}`
  }

  searchLogCreatePredefined() {
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => $allLogs.text().includes(this.textLogCreatePredefined()),
      this.configOption
    )
  }
  searchLogDeletePredefined() {
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => $allLogs.text().includes(this.textLogDeletePredefine()),
      this.configOption
    )
  }
  searchLogDeprecatePredefined() {
    recurse(
      () => this.elBodyLogs(),
      ($allLogs) => $allLogs.text().includes(this.textLogDeprecatePredefined()),
      this.configOption
    )
  }

  expectFoundCreatePredefined() {
    cy.logInTestCase('Created predefined consent form')
    this.searchLogCreatePredefined()
    this.#expectOrganizationConsentCard(
      PersonalType.CREATED_PREDEFINED_FORM,
      this.textLogCreatePredefined()
    )
  }
  expectFoundDeletePredefined() {
    cy.logInTestCase('Delete predefined consent form')
    this.searchLogDeletePredefined()
    this.#expectOrganizationConsentCard(
      PersonalType.DELETE_PREDEFINED_FORM,
      this.textLogDeletePredefine()
    )
  }
  expectFoundDeprecatePredefined() {
    cy.logInTestCase('Deprecate predefined consent form')
    this.searchLogDeprecatePredefined()
    this.#expectOrganizationConsentCard(
      PersonalType.DEPRECATED_PREDEFINED_FORM,
      this.textLogDeprecatePredefined()
    )
  }
  #expectOrganizationConsentCard(personalType, cardTitle) {
    cy.get(`span:contains('${personalType}'):contains('${this.consentName}')`)
      .parents('.align-items-start')
      .invoke('text')
      .then((text) => {
        expect(text).to.include(cardTitle)
        expect(text).to.include(`Organization: ${this.organizationName}`)
      })
  }
}
export default OrganizationConsentLog
