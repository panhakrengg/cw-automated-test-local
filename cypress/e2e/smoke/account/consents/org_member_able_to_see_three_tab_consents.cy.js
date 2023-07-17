import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import CommunityConsent from '../../../../classes/account/consents/personnel-consent/CommunityConsent'
import ConsentConstant from '../../../../classes/account/consents/personnel-consent/ConsentConstant'
import CoursesConsent from '../../../../classes/account/consents/personnel-consent/CoursesConsent'
import OthersConsent from '../../../../classes/account/consents/personnel-consent/OthersConsent'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const consentSetting = new ConsentSettings()
  const yamlHelper = new YamlHelper('consent')

  let communityYamlData
  let courseYamlData
  let othersYamlData

  context(Story.consents, () => {
    before(() => {
      yamlHelper
        .read()
        .its('AccountSettings')
        .then((accountSettings) => {
          const { communities, courses, others } = accountSettings
          communityYamlData = communities
          courseYamlData = courses
          othersYamlData = others
        })
      SignInAs.orgMemberDesignFrontend()
    })

    it('Org Member able to see three tab consents', () => {
      Story.ticket('QA-964')
      consentSetting.visit()

      context('Should able to see three tabs', () => {
        consentSetting._shouldAbleToSeeConsentTab(ConsentConstant.consentTabs)
      })

      context('Verify Communities Tab', () => {
        const communityConsent = new CommunityConsent(communityYamlData)
        communityConsent.verifyCommunityConsentItem()
      })

      context('Verify Courses Tab', () => {
        const coursesConsent = new CoursesConsent(courseYamlData)
        coursesConsent.verifyCourseConsentItem()
      })

      context('Verify Others Tab', () => {
        const otherConsent = new OthersConsent(othersYamlData)
        otherConsent.verifyOthersConsentItem()
      })
    })
  })
})
