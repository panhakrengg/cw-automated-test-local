import InterceptAction from '../base/InterceptAction'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import EmailMyProfile from '../notification/email/EmailMyProfile'
import EmailHelper from '../utilities/EmailHelper'
import MyProfile from './MyProfile'

class ProfileConnection extends MyProfile {
  emailHelper = new EmailHelper()
  itcGetConnectionOptions = new InterceptReq('/connections/get_options', 'GetConnectionOptions')
  itcRemoveConnection = new InterceptAction('/user_connection/remove', 'RemoveConnection')
  selectorConnectionCard = {
    $el: `.connection-card:first`,
    title: `.user-card-title`,
    footer: `.user-card-footer`,
  }
  clickProfileUserCard() {
    cy.get(this.selectorConnectionCard.$el).click()
  }
  clickAddConnectionButton(callback = () => {}) {
    cy.get(this.selectorConnectionCard.$el).as('connectCard').within(($connectionCard) => {
      if ($connectionCard.find('span:contains("Add Connection")').length) {
        cy.get('button > span:contains("Add Connection")').click()
        callback()
      }
    })
  }
  resetConnection(screenName) {
    this.isConnected()
    cy.get('@isConnected').then((isConnected) => {
      if (isConnected) {
        this.expectedUserExistInMyConnection(screenName)
        this.removeConnection()
      }
    })
  }
  setIsDoneCancelRequest(progress = false) {
    let isDone = progress
    cy.wrap(isDone).as('isDoneCancelRequest')
  }
  checkCancelRequestConnect() {
    this.setIsDoneCancelRequest()
    this.isRequestConnect()
    cy.get('@isRequestConnect').then((isRequestConnect) => {
      if (isRequestConnect) {
        this.clickProfileUserCard()
        this.cancelConnectionRequest()
        this.showConnectButton()
        this.setIsDoneCancelRequest(true)
      }
    })
  }
  sendRequestConnection(note = 'Note') {
    cy.get('@connectCard').swal2().within(($swal2) => {
      cy.wrap($swal2).contains('#swal2-title', 'Add Connection')
      cy.get('#personalNote').type(note)
      cy.get('button:contains("Connect")').click()
    })
  }
  showConnectionRequestSentButton() {
    cy.get(this.selectorConnectionCard.$el).within(() => {
      cy.contains('a > span', 'Connection Request Sent')
        .should('be.visible')
        .parent()
        .should('have.attr', 'disabled')
    })
  }
  showConnectionRequestSentButtonInMyProfile() {
    cy.contains('button.connect-button', 'Connection Request Sent').should('be.visible')
  }
  verifyConnectionRequestEmail(email) {
    this.emailHelper
      .getReceivedEmail(EmailMyProfile.CONNECTION_REQUEST_SUBJECT, email)
      .then(($receiveEmail) => {
        this.verifyConnectionRequestEmailTemplate($receiveEmail)
      })
  }
  verifyConnectionRequestEmailTemplate(subject) {
    const emailTemplate = new DOMParser().parseFromString(subject, 'text/html')
    if (emailTemplate.getElementsByTagName('table').length) {
      cy.wrap(subject).emailContains(EmailMyProfile.CONNECTION_REQUEST_HEADER)
      cy.wrap(subject).emailContains(EmailMyProfile.CONNECTION_REQUEST_BODY_1)
      cy.wrap(subject).emailContains(EmailMyProfile.CONNECTION_REQUEST_BODY_2)
    }
  }
  cancelConnectionRequest() {
    cy.contains('button.connect-button', 'Connection Request Sent').click()
    cy.getPopup().within(($popup) => {
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          cy.contains('a', 'Cancel this request').should('be.visible').click()
        })
    })
  }
  cancelConnectionRequestWithNote(popup, personalNote) {
    cy.contains('button.connect-button', 'Connection Request Sent').click()
    cy.getPopup().within(($popup) => {
      cy.wrap($popup).checkPopupHeader(popup.title)
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          cy.contains('p', popup.description).should('be.visible')
          cy.contains(popup.noteHeader).should('be.visible')
          cy.contains(personalNote).should('be.visible')
          cy.contains('a', popup.link).should('be.visible').click()
        })
    })
  }
  showConnectButton() {
    cy.contains('button.connect-button', 'Connect').should('be.visible')
  }
  sendRequestConnectionInMyProfile(popup, note, screenName) {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup).checkPopupHeader(popup.title)
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          cy.contains('p', `${popup.description} ${screenName}`).should('be.visible')
          cy.contains(popup.noteHeader).should('be.visible')
          cy.get(`textarea[placeholder="${popup.placeholder}"]`).type(note)
        })
      cy.wrap($popup)
        .getPopupFooter()
        .within(() => {
          cy.get(`button:contains("${popup.link}")`).click()
        })
    })
  }
  visitMyConnectionPage() {
    this.itcGetConnectionOptions.set()
    cy.visit('/web/guest/my-connections')
    this.itcGetConnectionOptions.wait()
  }
  buttonConnectionCard() {
    return `${this.selectorConnectionCard.footer} span`
  }
  expectedUserExistInMyConnection(screenName) {
    cy.get(`${this.selectorConnectionCard.title}:contains("${screenName}")`)
      .parents(this.selectorConnectionCard.$el)
      .within(($connectionCard) => {
        cy.wrap($connectionCard).as('connectionCard')
        cy.contains(this.selectorConnectionCard.title, screenName).should('be.visible')
        cy.contains(this.buttonConnectionCard(), 'Message').should('be.visible')
      })
  }
  removeConnection() {
    this.itcRemoveConnection.set()
    cy.get('@connectionCard').within(() => {
      cy.getThreeDots().click().clickDropdownName('Remove Connection')
    })
    cy.swal2().within(() => {
      cy.contains('.swal2-confirm', Field.YES_REMOVE).click()
    })
    this.itcRemoveConnection.wait()
  }
  verifyAddConnectionPopup(popup, note, screenName) {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup).checkPopupHeader(popup.title)
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          cy.contains('p', `${popup.description} ${screenName}`).should('be.visible')
          cy.contains(popup.noteHeader).should('be.visible')
          cy.get(`textarea[placeholder="${popup.placeholder}"]`).type(note)
        })
      cy.wrap($popup)
        .getPopupFooter()
        .within(() => {
          cy.get(`button:contains("${popup.link}")`).should('be.visible')
        })
    })
  }
  clickMessageButtonInMyConnection(screenName) {
    cy.get(`${this.selectorConnectionCard.title}:contains("${screenName}")`)
      .parents(this.selectorConnectionCard.$el)
      .within(($connectionCard) => {
        cy.wrap($connectionCard).contains(this.buttonConnectionCard(), 'Message').click()
      })
  }
  clickMessageButtonInGlobalSearch() {
    cy.get(`.connection-card`).contains(this.buttonConnectionCard(), 'Message').click()
  }
  expectedMiniChatOpenAndSeeChatName(name) {
    cy.get('.cw--messaging-panel').within(($message) => {
      cy.wrap($message)
        .get('.cw--panel-header')
        .eq(3)
        .within(() => {
          cy.contains('.cw--ellipsis-content', name).should('be.visible')
        })
    })
    cy.get('.cw--overlay').click()
  }
  isConnected() {
    this.checkButtonConnectionStatus('Message', 'isConnected')
  }
  isRequestConnect() {
    this.checkButtonConnectionStatus('Connection Request Sent', 'isRequestConnect')
  }
  checkButtonConnectionStatus(buttonText, alias) {
    let isRequestConnect = false
    cy.wrap(isRequestConnect).as(alias)
    cy.get(this.buttonConnectionCard()).then(($button) => {
      if ($button[0].outerText == buttonText) {
        isRequestConnect = true
        cy.wrap(isRequestConnect).as(alias)
      }
    })
  }
}

export default ProfileConnection
