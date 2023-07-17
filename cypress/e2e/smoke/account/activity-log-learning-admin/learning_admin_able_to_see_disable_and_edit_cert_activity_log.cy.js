import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityLogYamlStub from '../../../../classes/account/stub/ActivityLogYamlStub'
import Environment from '../../../../classes/base/Environment'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'

describe(Epic.Account, () => {
  const activityLogs = new ActivityLogs()
  const activityLogYamlStub = new ActivityLogYamlStub()
  const environment = new Environment()

  context(Story.activityLogLearningAdmin, () => {
    let date = '10 Feb, 2023'
    let learningAdminUserFullName
    let orgName
    let editLogIndex = 0
    let disabledLogIndex = 0
    before(() => {
      activityLogYamlStub._getAuAcOrgAdminFullName((user) => {
        learningAdminUserFullName = user.givenName + ' ' + user.familyName
      })
      if (environment.isPrd()) {
        date = '28 Feb, 2023'
        editLogIndex = 1
      }
      orgName = OrgConst.NAME
    })

    it('Learning Admin able to see activity logs disable and edit certificate', () => {
      Story.ticket('QA-1422')
      AccountUserStub.signInAsAuAcOrgAdmin()
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(ActivityCategories.LEARNING_ADMINISTRATION)
      activityLogs.accessActivityLog()

      cy.logInTestCase('Disabled Certificate')
      activityLogs.containLogDisabledCertificate(
        date,
        learningAdminUserFullName,
        orgName,
        disabledLogIndex
      )

      cy.logInTestCase('Edit Certificate Template')
      activityLogs.containLogEditCertificateTemplate(
        date,
        learningAdminUserFullName,
        orgName,
        editLogIndex
      )
    })
  })
})
