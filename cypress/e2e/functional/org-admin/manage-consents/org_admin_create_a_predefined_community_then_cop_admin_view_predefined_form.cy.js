import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Environment from '../../../../classes/base/Environment'
import InterceptReq from '../../../../classes/base/InterceptReq'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let form
  let formName
  let itcFetchCopMember = new InterceptReq('/dynamic_member/member/fetch', 'fetchCopMember')
  const manageConsent = new ManageConsent()
  const manageCopConsent = new ManageCopConsent()

  const accessToCopAdminTab = () => {
    itcFetchCopMember.set()
    SignInAs.reSignInAsTeamLeader('/web/weblearn-consent-training-automate/admin/admin')
    itcFetchCopMember.wait()
  }

  beforeEach(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      form = YAML.parse(consentString).CreateConsentForms.auConsentTrainingAutomate
      formName = form.name.new
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Org Admin create a consent form join community and admin CoP view a new predefined form', () => {
      // TODO: Something go wrong with visit /web/weblearn-consent-training-automate/admin/admin in Beta
      if (!new Environment().isBeta()) {
        SignInAs.orgAdmin()
        manageConsent.cleanUpConsentFormByDeprecatedAndDelete(formName)
        manageConsent.createForm(form)
        manageConsent.save()

        accessToCopAdminTab()
        manageCopConsent.accessToManageConsent()
        manageCopConsent.enableConsent()
        manageCopConsent.expectAvailablePredefinedForm(formName)
        manageCopConsent.selectPredefinedForm(formName)
        manageCopConsent.expectEnableNextButton()
      }
    })
  })
})
