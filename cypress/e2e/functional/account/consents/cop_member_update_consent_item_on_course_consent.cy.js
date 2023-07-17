import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, { retries: 1 }, () => {
  const accountYamlHelper = new YamlHelper('account')
  const consentSettings = new ConsentSettings()

  context(Story.consents, () => {
    let acceptedConsent

    before(() => {
      accountYamlHelper
        .read()
        .its('Consents')
        .then((data) => {
          acceptedConsent = data.acceptedConsent
        })
    })

    it('CoP Member update consent item on course consent', () => {
      Story.ticket('QA-978')
      context('Visit my account consent', () => {
        SignInAs.orgMemberDesignFrontend()
        consentSettings.visit()
        consentSettings.accessConsentTab('Courses')
        consentSettings.getConsentItem(acceptedConsent.name)
      })

      context('Reset data', () => {
        consentSettings.editConsent()
        consentSettings.uncheckConsentItemBy(acceptedConsent.consentItems[1])
        consentSettings.checkConsentItemBy(acceptedConsent.consentItems[2])
        consentSettings.clickButtonUpdateConsent()
      })

      context('Edit consent form', () => {
        consentSettings.editConsent()
        consentSettings.checkConsentItemBy(acceptedConsent.consentItems[1])
        consentSettings.uncheckConsentItemBy(acceptedConsent.consentItems[2])
        consentSettings.clickButtonUpdateConsent()
      })

      context('View consent form', () => {
        consentSettings.viewConsent()
        consentSettings.verifyConsentItemIsDisabledAndCheckedBy(acceptedConsent.consentItems[1])
        consentSettings.verifyConsentItemIsDisabledAndUncheckedBy(acceptedConsent.consentItems[2])
      })
    })
  })
})
