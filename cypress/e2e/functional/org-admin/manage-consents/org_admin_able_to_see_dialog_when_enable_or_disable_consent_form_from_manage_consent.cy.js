import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'

describe(Epic.OrgAdmin, () => {
  context(Story.orgAdminManageConsents, () => {
    const manageConsent = new ManageConsent()

    beforeEach(() => {
      manageConsent.accessToManageOrgConsent()
    })

    it('Org Admin able to see dialog when enable consent form from manage consent', () => {
      manageConsent.enableOrDisableOrgConsent(Field.DISABLED)
      manageConsent.verifyConfirmDialogOnEnableOrDisableOrgConsent(Field.ENABLE)
    })

    it('Org Admin able to see dialog when disable consent form from manage consent', () => {
      manageConsent.enableOrDisableOrgConsent('Enabled')
      manageConsent.verifyConfirmDialogOnEnableOrDisableOrgConsent(Field.DISABLE)
    })
  })
})
