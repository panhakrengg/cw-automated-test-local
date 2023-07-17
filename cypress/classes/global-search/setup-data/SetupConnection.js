import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import WebNotification from '../../notification/WebNotification'

class SetupConnection {
  itcAddConnection = new InterceptReq('addConnection', 'AddConnection')

  addThenAcceptConnection(user) {
    this.addConnection(user)
    cy.signInViaEmail(user.email)
    new WebNotification().acceptRequest('would like to add you as a connection.')
  }

  addConnection(user) {
    this.itcAddConnection.set()
    cy.searchGlobal(user.screenName)
    cy.get('.connection-card')
      .invoke('text')
      .then((text) => {
        if (text.includes('Add Connection')) {
          cy.clickButtonByName('Add Connection')
          cy.swal2().within(() => cy.clickButtonByName(Field.CONNECT))
          this.itcAddConnection.wait()
        }
      })
  }
}
export default SetupConnection
