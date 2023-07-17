import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import EmailAdminCoPConsent from '../../../../classes/notification/email/cop-consent/EmailAdminCoPConsent'
import EmailMemberCoPConsent from '../../../../classes/notification/email/cop-consent/EmailMemberCoPConsent'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const consentSetting = new ConsentSettings()
  const manageCoPConsent = new ManageCopConsent()
  const cwUsers = new YamlHelper('users')
  const orgWebLearnUser = new YamlHelper('users-orgmgt')
  const copNameMock = 'TCoP tracking opt out functionality'
  const emailAdminCoPConsent = new EmailAdminCoPConsent(copNameMock)

  context(Story.notificationsConsent, () => {
    let orgMgtAdministrator, copOwner, copMember
    before(() => {
      cwUsers
        .read()
        .its('Users.uat')
        .then((user) => {
          copOwner = user.auOptOutOwner
          copMember = user.auOptOutMember
        })

      orgWebLearnUser
        .read()
        .its('Users.uat')
        .then((user) => {
          orgMgtAdministrator = user.orgMgtAdmin
        })
    })

    it('CoP Owner User opt out consents managed when CoP Member opt out given consent', () => {
      Story.ticket('QA-1518')
      let cop = '/web/tcop-tracking-opt-out-functionality/'
      cy.visitThenSignIn(consentSetting.getUrl(), 'CWUsers.auOptOutMember')
      const emailMemberCoPConsent = new EmailMemberCoPConsent(copNameMock, copMember)
      context('reset consent by revoke', () => {
        consentSetting.accessConsentTab()
        cy.wrap(consentSetting.findConsentItemBy(copNameMock)).then(($isContain) => {
          if ($isContain) {
            consentSetting.getConsentItem(copNameMock)
            consentSetting.revokeConsent()
          }
        })
      })
      cy.logInTestCase('CoP Member accept consent')
      consentSetting._itcFetchConsentsForm.set()
      cy.visit(cop)
      consentSetting._itcFetchConsentsForm.wait()
      manageCoPConsent.acceptConsentForm()

      cy.logInTestCase('Expect CoP Owner note get email notification')
      emailAdminCoPConsent.verifyOptOutOnMemberGaveConsent(copOwner)
      emailAdminCoPConsent.verifyOptOutOnMemberRevokeConsent(copOwner)

      cy.logInTestCase('Expect CoP Member not receive emails')
      emailMemberCoPConsent.verifyOptOutGaveConsentEmail()

      cy.logInTestCase('Expect CoP Administrator receive emails')
      emailAdminCoPConsent.verifyMemberGaveConsentEmail(orgMgtAdministrator, copMember)
      emailAdminCoPConsent.verifyMemberRevokeConsentEmail(orgMgtAdministrator, copMember)
    })
  })
})
