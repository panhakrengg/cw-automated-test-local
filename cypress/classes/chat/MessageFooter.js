class MessageFooter {
  captureMainAreaFooter(captureName) {
    const captureFullScreen = captureName + '-full-screen'
    cy.get('.cw--rte').focus().blur()
    cy.get('.cw--chat-main-area-footer > .cw--box').as('mainAreaFooter')

    cy.get('@mainAreaFooter').compareTabletSnapshot(captureName)

    cy.get('@mainAreaFooter').compareDesktopSnapshot(captureName)
    cy.get(
      '.cw--messaging-header > .cw--box > .cw--chat-toolbar > .cw--row > :nth-child(3) > .cw--container > .cw--messaging-left-panel-fullscreen-button'
    )
      .as('fullScreen')
      .click()

    cy.get('@mainAreaFooter').compareTabletSnapshot(captureFullScreen)
    cy.get('@mainAreaFooter').compareDesktopSnapshot(captureFullScreen)
  }
}

export default MessageFooter
