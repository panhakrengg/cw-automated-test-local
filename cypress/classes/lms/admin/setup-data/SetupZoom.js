import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'
import SignInAs from '../../../utilities/SignInAs'

class SetupZoom {
  constructor() {
    this.login = new Login()
  }

  #ifShowError(subject) {
    const zoomNotValid =
      'Zoom credentials are not valid or required permission scopes are not provided.'
    cy.wrap(subject)
      .invoke('text')
      .then((text) => {
        if (text.includes(zoomNotValid)) {
          cy.contains('Account ID').parents('div.form-group').find('input').type('{moveToEnd} ')
          Itc.validateCredentials.wait()
          cy.contains('Account ID').parents('div.form-group').find('input').type('{backspace}')
        }
      })
  }

  createZoom(zoom) {
    const { name, category, accountId, clientId, clientSecret, hostEmail } = zoom
    cy.cwTable()
      .invoke('text')
      .then((text) => {
        if (!text.includes(name)) {
          Itc.validateCredentials.set()
          Itc.updateZoomAccount.set()

          cy.clickButtonByName('Add Zoom Integration')
          cy.swal2().within(($popup) => {
            cy.inputFormGroup('Integration Name', name)
            cy.clickCwDropdownItem(category)
            cy.inputFormGroup('Account ID', accountId)
            cy.inputFormGroup('Client ID', clientId)
            cy.inputFormGroup('Client Secret', clientSecret)
            Itc.validateCredentials.wait()
            cy.inputFormGroup('Host Email', hostEmail)
            this.#ifShowError($popup)

            cy.wait(2000)
            cy.clickButtonByName(Field.SAVE)
            Itc.updateZoomAccount.wait()
          })
        }
      })
  }
}

class Itc {
  static fetchHelpGuideZoomSetting = new InterceptReq(
    '/zoom_setting/fetch_help_guide_url',
    'FetchHelpGuideZoomSetting'
  )
  static validateCredentials = new InterceptReq(
    '/setting/zoom_integration/validate_credentials',
    'ValidateCredentials'
  )
  static updateZoomAccount = new InterceptReq('/setting/zoom_account/update', 'UpdateZoomAccount')
}

class Login {
  #getZoomUrl() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/settings`
  }

  #visitZoomIntegrations(signIn = () => {}) {
    Itc.fetchHelpGuideZoomSetting.set()
    signIn()
    cy.get('.cec-card__left-content .cec-mt-1').within(() =>
      cy.clickLinkByName('Zoom Integrations')
    )
    Itc.fetchHelpGuideZoomSetting.wait()
  }

  asLearningAdmin() {
    this.#visitZoomIntegrations(SignInAs.learningAdminEmery(this.#getZoomUrl()))
  }
}
export default SetupZoom
