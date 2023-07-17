import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const accountYamlHelper = new YamlHelper('account')
  const consentSettings = new ConsentSettings()

  context(Story.consents, () => {
    let agreeWithConsent

    before(() => {
      accountYamlHelper
        .read()
        .its('Consents')
        .then((data) => {
          agreeWithConsent = data.agreeWithConsent
        })
    })

    it('CoP Member update consent item on community consent', () => {
      Story.ticket('QA-977')
      context('Visit my account consent', () => {
        SignInAs.orgMemberDesignFrontend()
        consentSettings.visit()
        consentSettings.accessConsentTab('Communities')
        consentSettings.getConsentItem(agreeWithConsent.name)
      })

      context('Reset data', () => {
        consentSettings.editConsent()
        consentSettings.checkConsentItemBy(agreeWithConsent.consentItems[0])
        consentSettings.clickButtonUpdateConsent()
      })

      context('Edit consent form', () => {
        consentSettings.editConsent()
        consentSettings.uncheckConsentItemBy(agreeWithConsent.consentItems[0])
        consentSettings.clickButtonUpdateConsent()
      })

      context('View consent form', () => {
        consentSettings.viewConsent()
        consentSettings.verifyConsentItemIsDisabledAndUncheckedBy(agreeWithConsent.consentItems[0])
      })
    })
  })
})
