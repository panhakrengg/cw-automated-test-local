import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 1 }, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()
  const globalSearch = new GlobalSearch()
  context(Story.profileContactInfo, () => {
    const accountEmail = 2
    const firstContactEmail = 3
    let screenName
    let email

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        const teamLeader = data.users.teamLeader
        screenName = teamLeader.contactInfo.screenName
        email = teamLeader.contactInfo.emails.personal.emails[0]
      })
    })

    beforeEach(() => {
      contactInfo.login.toProfilePageAsTeamLeader()
    })

    function resetData() {
      contactInfo.clickEditContactInfo()
      cy.get('input[name="_myProfilePortlet_preferred-email-address"]')
        .first()
        .invoke('prop', 'checked')
        .then(($checked) => {
          if ($checked) return
          contactInfo.changePreferredEmail(accountEmail)
          contactInfo.clickUpdateContactInfoButton()
          contactInfo.expectedUpdateButtonDisabled()
          contactInfo.expectedShowSuccessUpdateToast()
        })
    }

    it('Team Leader set preferred email', () => {
      Story.ticket('QA-809')

      cy.logInTestCase('Prepare data')
      resetData()

      cy.logInTestCase('Set preferred email')
      contactInfo.changePreferredEmail(firstContactEmail)
      contactInfo.clickUpdateContactInfoButton()
      contactInfo.expectedUpdateButtonDisabled()
      contactInfo.expectedShowSuccessUpdateToast()

      cy.logInTestCase('View by team leader himself')
      contactInfo.goBackToProfileInfo()
      profileInfo.checkEmail(email, 'Personal - Preferred')

      cy.logInTestCase('View by org admin')
      SignInAs.orgAdmin()
      globalSearch.search(screenName)
      profileInfo.checkEmailInGlobalSearch(email)
      profileInfo.clickProfileUserCard()
      profileInfo.checkEmail(email, 'Personal - Preferred')

      cy.logInTestCase('View by freemium user')
      SignInAs.freemiumUser()
      globalSearch.search(screenName)
      profileInfo.checkEmailInGlobalSearch(email)
      profileInfo.clickProfileUserCard()
      profileInfo.checkEmail(email, 'Personal - Preferred')

      cy.logInTestCase('View by org member')
      SignInAs.orgMember()
      globalSearch.search(screenName)
      profileInfo.checkEmailInGlobalSearch(email)
      profileInfo.clickProfileUserCard()
      profileInfo.checkEmail(email, 'Personal - Preferred')

      cy.logInTestCase('Reset data')
      contactInfo.login.toProfilePageAsTeamLeader()
      resetData()
    })
  })
})
