class MessageInput {
  addAttachment(attachemntPath) {
    cy.get('.cw--file-picker > input').attachFile(attachemntPath)
  }
  typeMessage(messageText) {
    cy.get('.cw--rte').as('messageInput').type(messageText)
  }
}

export default MessageInput
