import Field from '../../../../constants/Field'
import { CopAdministrationConstant } from '../../base/CopAdministrationConstant'

export default class ManageMemberQuery {
  getButtonInvite() {
    return cy.get('button:contains("Invite")').first()
  }

  getTableRowMemberByEmail(email) {
    return cy.getElementWithLabel(email, 'span').parents('tr')
  }

  getInputSearchYourConnections() {
    return cy.getInputByPlaceholder(CopAdministrationConstant.searchConnections)
  }

  getInputSearchYourConnectionsAndOrganization() {
    return cy.getInputByPlaceholder(CopAdministrationConstant.searchConnectionsAndOrg)
  }

  getInputSearchInInvitePopup() {
    return cy.getInputFeedback()
  }

  getLinkInviteViaEmail() {
    return cy.get('a:contains("invite via email")')
  }

  getInputInviteEmail() {
    return cy.get(`input[placeholder="Enter e-mail address"]`)
  }

  getEmailTemplateLinks(isNonCwUser, url) {
    return isNonCwUser
      ? [
          {
            name: Field.CREATE_NEW_ACCOUNT,
            url: '/o/redirect/inv?ticket=',
            alias: 'aliasCreateNewAccount',
          },
          {
            name: Field.ACCEPT_WITH_EXISTING_ACCOUNT,
            url: '/o/cw-cop-rest/cop/acceptSubscription?ticket=',
            alias: 'aliasAcceptExistingAccount',
          },
        ]
      : [
          {
            name: Field.ACCEPT_INVITATION,
            url: url,
            alias: 'aliasAcceptInvitation',
          },
        ]
  }
}
