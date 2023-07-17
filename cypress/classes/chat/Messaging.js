import GlobalMenu from '../global-menu/GlobalMenu'
import EmailHelper from '../utilities/EmailHelper'

class Messaging {
  _roomName
  #emailHelper = new EmailHelper()
  constructor(roomName) {
    this._roomName = roomName
  }
  accessToMessage() {
    cy.intercept('**%2Fmessaging%2Fchat_rooms%2Fdetails%2Fget**').as('GetMessageProfile')
    GlobalMenu.openChat()
    cy.wait('@GetMessageProfile')
    cy.get('.cw--input[placeholder="Search people and groups"]').type(`${this._roomName}`)
    cy.get('.cw--ellipsis-content').contains(`${this._roomName}`).click()
  }
  clickIconSendMessage() {
    cy.get('svg.cw--text-blue').first().parents('button.cw--button-icon').click()
  }
  verifyEmailNotificationForUnreadMessage(subject, recipient, buttonName, url) {
    this.#emailHelper
      .getReceivedEmail(subject, recipient, true)
      .emailTableBody()
      .then((template) => {
        this.#emailHelper.setTemplate(template)
        this.#emailHelper.verifyLinkButton(
          buttonName,
          location.protocol + '//' + url + '/web/guest/messaging'
        )
      })
  }
}

export default Messaging
