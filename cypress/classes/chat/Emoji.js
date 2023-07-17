class Emoji {
  captureEmojiGeneral() {
    cy.get(
      ':nth-child(2) > .cw--dropdown > .cw--dropdown-trigger > .cw--button > .cw--button-content > .cw--icon'
    )
      .as('emoji')
      .click()
    cy.intercept('POST', '**/api/**').as('getEmoji')
    cy.get(':nth-child(1) > .cw--link-black').as('emojiGeneral').click()
    cy.wait('@getEmoji')
    cy.wait(7000)
    this.captureEmojiArea('emoji-general')
    cy.get(
      '.cw--messaging-header > .cw--box > .cw--chat-toolbar > .cw--row > :nth-child(3) > .cw--container > .cw--messaging-left-panel-fullscreen-button'
    )
      .as('fullScreen')
      .click()
    cy.get('@emoji').click()
    cy.get('@emojiGeneral').click()
    this.captureEmojiArea('emoji-general-full-screen')
  }
  captureEmojiArea(captureName) {
    cy.get('.cw--emoji-picker').compareSnapshot(captureName)
  }
  add() {
    cy.get(
      ':nth-child(2) > .cw--dropdown > .cw--dropdown-trigger > .cw--button > .cw--button-content > .cw--icon'
    ).click()
  }
  react(number) {
    cy.get(
      `:nth-child(${number}) > .cw--emoji-picker-list-item > .cw--icon-md`
    ).click()
  }
}

export default Emoji
