import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityLogYamlStub from '../../../../classes/account/stub/ActivityLogYamlStub'
import Environment from '../../../../classes/base/Environment'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const activityLogs = new ActivityLogs()
  const activityLogYamlStub = new ActivityLogYamlStub()
  const environment = new Environment()

  context(Story.activityLogLearningAdmin, () => {
    let editDate
    let editIndexLog
    let revertDate
    let revertIndexLog

    let certData
    let learningAdminUserFullName
    let orgName
    before(() => {
      new YamlHelper('account')
        .read()
        .its('ActivityLogStatic.Certificate')
        .then((data) => {
          certData = data
          if (environment.isPrd()) {
            revertDate = certData.revert.prd.date
            revertIndexLog = certData.revert.prd.index
            editDate = certData.edit.prd.date
            editIndexLog = certData.edit.prd.index
          } else {
            if (environment.isBeta()) {
              editDate = certData.edit.beta.date
              revertDate = certData.revert.beta.date
            } else {
              editDate = certData.edit.uat.date
              revertDate = certData.revert.uat.date
            }
            editIndexLog = certData.edit.uat.index
            revertIndexLog = certData.revert.uat.index
          }
        })
      activityLogYamlStub._getAuAcOrgAdminFullName((user) => {
        learningAdminUserFullName = user.givenName + ' ' + user.familyName
      })
      orgName = OrgConst.NAME
    })

    it('Course Administrator able to see own record log after editing a certificate in EN', () => {
      Story.ticket('QA-1424')

      AccountUserStub.signInAsAuAcOrgAdmin()
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(ActivityCategories.LEARNING_ADMINISTRATION)
      cy.wait(1000)
      cy.logInTestCase('Revert Data for Certificate log')
      activityLogs.containLogEditCertificateTemplate(
        revertDate,
        learningAdminUserFullName,
        orgName,
        1
      )
      activityLogs.containLogEditCertificate(certData.revert.logs)

      cy.logInTestCase('Edit New Data for Certificate log')
      activityLogs.containLogEditCertificateTemplate(
        editDate,
        learningAdminUserFullName,
        orgName,
        2
      )
      activityLogs.containLogEditCertificate(certData.edit.logs)
    })
  })
})
