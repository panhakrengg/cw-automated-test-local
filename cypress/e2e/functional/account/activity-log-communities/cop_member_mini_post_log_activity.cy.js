import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import CommunityHome from '../../../../classes/cop/CommunityHome'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Field from '../../../../classes/constants/Field'

const COMMUNITIES = ActivityCategories.COMMUNITIES

describe(Epic.Account, { retries: 1 }, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const activityLogs = new ActivityLogs()
  const communityHome = new CommunityHome()

  context(Story.activityCommunities, () => {
    let auAcFuncMemberName
    let currentTimeStamp
    let content
    let tCopForMemberTrackingActivity
    let tCopForMemberSharePostTrackingActivity

    before(() => {
      //TODO: can be removed later if the session of user(auAcFuncMember) starts working again
      Cypress.session.clearCurrentSessionData()
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          const auAcFuncMember = user.auAcFuncMember
          auAcFuncMemberName = auAcFuncMember.familyName + ' ' + auAcFuncMember.givenName
        })
      accountYamlHelper
        .read()
        .its('Organizations.webLearn.communities')
        .then((communities) => {
          tCopForMemberTrackingActivity = communities.tCopForMemberTrackingActivity.name
          tCopForMemberSharePostTrackingActivity =
            communities.tCopForMemberSharePostTrackingActivity.name
        })
    })

    beforeEach(() => {
      AccountUserStub.signInAsAuAcFuncMember()
    })

    it('CoP Member add a mini post in CoP then logs activity - Communities', () => {
      Story.ticket('QA-1387')

      cy.logInTestCase(`Add a new mini post to community ${tCopForMemberTrackingActivity}`)
      currentTimeStamp = Date.now()
      content = 'Add a new post ' + currentTimeStamp
      communityHome.visitHome(`/web/${tCopForMemberTrackingActivity}`)
      communityHome.addNewMiniPost(content)

      cy.logInTestCase('Verify add a mini post community log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(COMMUNITIES)
      activityLogs.containLogPostTo(
        auAcFuncMemberName,
        tCopForMemberTrackingActivity,
        activityLogs.getCurrentDate()
      )

      cy.logInTestCase('Reset data')
      communityHome.visitHome(`/web/${tCopForMemberTrackingActivity}`)
      communityHome.removeMiniPost(content)
    })

    it('CoP Member edit a mini post in CoP then logs activity - Communities', () => {
      Story.ticket('QA-1384')
      let newContent

      cy.logInTestCase(`Add a new mini post in ${tCopForMemberTrackingActivity}`)
      currentTimeStamp = Date.now()
      content = 'Add a new post ' + currentTimeStamp
      communityHome.visitHome(`/web/${tCopForMemberTrackingActivity}`)
      communityHome.addNewMiniPost(content)

      cy.logInTestCase(`Edit a mini post in ${tCopForMemberTrackingActivity}`)
      newContent = content + Field.UPDATE
      communityHome.editMiniPost(content, newContent)

      cy.logInTestCase('Verify edit a mini post community log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(COMMUNITIES)
      activityLogs.containLogEditPostIn(
        auAcFuncMemberName,
        tCopForMemberTrackingActivity,
        activityLogs.getCurrentDate()
      )

      cy.logInTestCase('Reset data')
      communityHome.visitHome(`/web/${tCopForMemberTrackingActivity}`)
      communityHome.removeMiniPost(newContent)
    })

    it('CoP Member share a mini post in CoP then logs activity - Communities', () => {
      Story.ticket('QA-1388')
      communityHome.visitHome(`/web/${tCopForMemberSharePostTrackingActivity}`)
      communityHome.clickShareIcon('Keep for track share post (Automation Please Do Not Delete)')
      communityHome.getFirstCopNameInSharePostPopup().then(($shareCopName) => {
        cy.logInTestCase('Share mini post to cop')
        communityHome.selectShareCopBy($shareCopName)
        communityHome.fillInShareThoughtAndPost()

        cy.logInTestCase('Verify share a mini post community log')
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(COMMUNITIES)
        activityLogs.containLogSharedPostFromCopToCop(
          auAcFuncMemberName,
          tCopForMemberSharePostTrackingActivity,
          $shareCopName,
          activityLogs.getCurrentDate()
        )
      })
    })
  })
})
