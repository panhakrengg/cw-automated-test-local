import Admin from '../../../classes/cop/Admin'
import Epic from '../../../classes/Epic'
import Registration from '../../../classes/my-profile/Registration'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'
import YamlHelper from '../../../classes/utilities/YamlHelper'

describe(Epic.Profile, { retries: 1 }, () => {
  context(Story.profileVisibility, () => {
    let nonCw01Email
    let teamLeader
    const admin = new Admin()
    const registration = new Registration()
    const sampleProfileYaml = new YamlHelper('profile/sample-profile')
    const nonCwUser = new YamlHelper('non-cw-users')
    before(() => {
      nonCwUser
        .read()
        .its('cw01.email')
        .then(($email) => {
          nonCw01Email = $email
        })
      sampleProfileYaml
        .read()
        .its('ProfileStatic')
        .then(($profileStatic) => {
          teamLeader = $profileStatic.users.teamLeader.contactInfo
        })
    })

    beforeEach(() => {
      admin.itcFetchManageMember.set()
      SignInAs.copOwner('/web/ind-automate/admin')
      admin.itcFetchManageMember.wait()
    })

    it('CoP Owner invite Non-Cw User into CoP and user create account and get validate screen name', () => {
      //This will avoid uncaught exception that didn't handle correctly by our application
      cy.once('uncaught:exception', () => false)
      Story.ticket('QA-833')
      context('Invite non cw user into cop', () => {
        admin.sendInviteEmails([nonCw01Email])
        admin.verifyInvitationEmailTemplate(nonCw01Email)
        admin.redirectToCreateNewAccount()
      })

      context('Verify registration form', () => {
        registration.fillInInfoToCreateNewAccount(teamLeader)
        registration.nextButtonIsEnabled()
        registration.expectedShowNotAvailableScreenName()
        registration.userStillInRegistrationPage()
      })
    })
  })
})
