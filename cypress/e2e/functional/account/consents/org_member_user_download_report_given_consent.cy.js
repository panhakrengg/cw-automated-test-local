import moment from 'moment'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import SpyOpenWindowEvent from '../../../../classes/base/SpyOpenWindowEvent'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserAccountUtil from '../../../../classes/utilities/UserAccountUtil'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const orgUserYamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const consentSettings = new ConsentSettings()
  const spyOpenWindowEvent = new SpyOpenWindowEvent()
  const userAccountUtil = new UserAccountUtil()
  context(Story.consents, () => {
    let acceptedConsent
    let memberFronted
    let memberFrontedFullName

    before(() => {
      orgUserYamlHelper
        .read()
        .its('Users.uat')
        .then((data) => {
          memberFronted = data.memberFronted
          memberFrontedFullName = memberFronted.givenName + ' ' + memberFronted.familyName
        })
      accountYamlHelper
        .read()
        .its('Consents')
        .then((data) => {
          acceptedConsent = data.acceptedConsent
        })
    })

    it('Org Member User download report given consent', () => {
      Story.ticket('QA-986')
      context('Visit my account consent', () => {
        SignInAs.orgMemberDesignFrontend()
        consentSettings.visit()
        consentSettings.accessConsentTab('Courses')
      })

      context('Verify download report', () => {
        let date = userAccountUtil.getDateByDefaultTimeZoneAndFormat('YYYY-MM-DD')
        //let time = moment().format('hour-minute-second') //Bug because the time is incorrect
        spyOpenWindowEvent.setSpy()
        consentSettings.clickLinkDownloadReportGivenConsent()
        spyOpenWindowEvent.getUrl().then(($url) => {
          cy.request($url.href)
            .its('headers.content-disposition')
            .then((data) => {
              expect(data).to.include(`${memberFrontedFullName}_Consents_${date}`)
            })
        })
      })
    })
  })
})
