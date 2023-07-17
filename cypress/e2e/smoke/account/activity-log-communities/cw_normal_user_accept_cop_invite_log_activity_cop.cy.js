import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import Environment from '../../../../classes/base/Environment'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const COMMUNITIES = ActivityCategories.COMMUNITIES

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const activityLogs = new ActivityLogs()
  const environment = new Environment()

  context(Story.activityCommunities, () => {
    let auAcMember
    let communities
    let date
    let time

    before(() => {
      yamlHelper
        .read()
        .its('Users.uat.auAcMember')
        .then((user) => {
          auAcMember = user.familyName + ' ' + user.givenName
        })
      accountYamlHelper
        .read()
        .its('Organizations.webLearn.communities')
        .then((data) => {
          communities = data
        })
      accountYamlHelper
        .read()
        .its('ActivityLogStatic.communities.acceptInvitation')
        .then((data) => {
          const activityLog = data[environment.getEnvPrefix()]
          date = activityLog.date
          time = activityLog.time
        })
    })

    beforeEach(() => {
      AccountUserStub.signInAsAuAcMember()
    })

    it('Cw Normal User accepts CoP invite then logs activity - Communities', () => {
      Story.ticket('QA-1382')
      context('Verify accepts to join community log', () => {
        activityLogs.accessActivityLog()
        cy.wait(1000)
        activityLogs.clickFilterActivityBy(COMMUNITIES)
        cy.logInTestCase('tCopInviteMember')
        activityLogs.containLogAcceptToJoinCop(
          auAcMember,
          communities.tCopInviteMember.name,
          time,
          date
        )
        cy.logInTestCase('oCopInviteMember')
        activityLogs.containLogAcceptToJoinCop(
          auAcMember,
          communities.oCopInviteMember.name,
          time,
          date
        )

        if (!environment.isPrd()) {
          cy.logInTestCase('tpCopInviteMember')
          activityLogs.containLogAcceptToJoinCop(
            auAcMember,
            communities.tpCopInviteMember.name,
            time,
            date
          )
          cy.logInTestCase('mwCopForEditConsent')
          activityLogs.containLogAcceptToJoinCop(
            auAcMember,
            communities.mwCopForEditConsent.name,
            time,
            date
          )
        }
      })
    })
  })
})
