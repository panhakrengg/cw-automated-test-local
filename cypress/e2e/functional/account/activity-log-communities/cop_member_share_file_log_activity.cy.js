import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Collaboration from '../../../../classes/cop/Collaboration'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const COMMUNITIES = ActivityCategories.COMMUNITIES

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const activityLogs = new ActivityLogs()

  context(Story.activityCommunities, () => {
    let auAcFuncMemberName
    let tCopForMemberTrackingActivity

    before(() => {
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
        })
    })

    beforeEach(() => {
      AccountUserStub.signInAsAuAcFuncMember()
    })

    it('CoP Member rename file and folder then logs activity - Communities', () => {
      Story.ticket('QA-1393')
      const collaboration = new Collaboration(tCopForMemberTrackingActivity)

      cy.logInTestCase('Reset data', () => {
        collaboration.visitFileSharing(tCopForMemberTrackingActivity)
        collaboration.clickFileSharingCommunityFolder()
        collaboration.renameFileOrFolderIfExist(
          collaboration.UPDATE_FILE_NAME,
          collaboration.FILE_NAME
        )
        collaboration.renameFileOrFolderIfExist(
          collaboration.UPDATE_FOLDER_NAME,
          collaboration.FOLDER_NAME
        )
      })

      cy.logInTestCase(`Rename file and folder ${tCopForMemberTrackingActivity}`, () => {
        collaboration.renameFolder(
          collaboration.UPDATE_FOLDER_NAME,
          'Rename',
          collaboration.FOLDER_NAME
        )
        collaboration.renameFile(collaboration.UPDATE_FILE_NAME, 'Rename', collaboration.FILE_NAME)
      })

      cy.logInTestCase('Verify rename file/folder in file sharing community log', () => {
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(COMMUNITIES)
        activityLogs.containLogRenameFileOrFolderInCop(
          auAcFuncMemberName,
          tCopForMemberTrackingActivity,
          collaboration.UPDATE_FILE_NAME,
          activityLogs.getCurrentDate()
        )
        activityLogs.containLogRenameFileOrFolderInCop(
          auAcFuncMemberName,
          tCopForMemberTrackingActivity,
          collaboration.UPDATE_FOLDER_NAME,
          activityLogs.getCurrentDate(),
          1
        )
      })
    })
  })
})
