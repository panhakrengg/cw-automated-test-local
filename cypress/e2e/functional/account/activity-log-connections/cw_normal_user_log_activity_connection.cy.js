import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import GlobalSearch from '../../../../classes/global-search/GlobalSearch'
import ProfileConnection from '../../../../classes/my-profile/ProfileConnection'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const CONNECTIONS = ActivityCategories.CONNECTIONS

describe(Epic.Account, { retries: 1 }, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const profileConnection = new ProfileConnection()
  const webNotification = new WebNotification()
  const globalSearch = new GlobalSearch()
  const activityLogs = new ActivityLogs()

  context(Story.activityLogConnections, () => {
    let auAcFuncMemberName
    let auAcFuncName
    let auAcFuncScreenName

    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          const auAcFuncMember = user.auAcFuncMember
          auAcFuncMemberName = auAcFuncMember.familyName + ' ' + auAcFuncMember.givenName
          const auAcFunc = user.auAcFunc
          auAcFuncName = auAcFunc.familyName + ' ' + auAcFunc.givenName
          auAcFuncScreenName = auAcFunc.screenName
        })
    })

    beforeEach(() => {
      AccountUserStub.signInAsAuAcFuncMember()
    })

    it('Cw Normal User add, accept, remove connection then logs activity - Connections', () => {
      Story.ticket('QA-1383')

      cy.logInTestCase('Sending connection request')
      globalSearch.search(auAcFuncScreenName)
      profileConnection.resetConnection(auAcFuncScreenName)
      profileConnection.checkCancelRequestConnect()
      cy.get('@isDoneCancelRequest').then((isDoneCancelRequest) => {
        if (isDoneCancelRequest) {
          globalSearch.search(auAcFuncScreenName)
        }
      })
      profileConnection.clickAddConnectionButton(() => {
        profileConnection.sendRequestConnection()
      })
      const timeWhenClickAdd = activityLogs.getCurrentDate()

      cy.logInTestCase('Verify sending connection request')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(CONNECTIONS)
      activityLogs.containLogSendConnectionRequest(
        auAcFuncMemberName,
        auAcFuncName,
        timeWhenClickAdd
      )

      cy.logInTestCase('Accept connection')
      AccountUserStub.signInAsAuAcFunc()
      webNotification.acceptRequest('would like to add you as a connection.')

      context('Remove connection', () => {
        profileConnection.visitMyConnectionPage()
        profileConnection.expectedUserExistInMyConnection(auAcFuncScreenName)
        profileConnection.removeConnection()
      })

      context('Navigate to personal activity log', () => {
        activityLogs.accessActivityLog()
        cy.wait(2000)
        activityLogs.clickFilterActivityBy(CONNECTIONS)
      })

      context('Verify accepted connection request', () => {
        activityLogs.containLogAcceptedConnectionRequest(
          auAcFuncName,
          auAcFuncMemberName,
          activityLogs.getCurrentDate()
        )
      })
    })
  })
})
