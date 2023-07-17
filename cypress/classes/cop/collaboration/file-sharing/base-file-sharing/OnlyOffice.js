class OnlyOffice {
  static interceptDocServer() {
    cy.intercept({
      method: 'GET',
      url: '**plugins.json**',
    }).as('getConfig')

    cy.intercept({
      method: 'GET',
      url: '*/sdkjs-plugins/zotero/config.json',
    }).as('pluginOffice')
  }

  static waitUntilRender() {
    cy.wait('@getConfig', { timeout: 60000 })
    cy.wait('@pluginOffice', { timeout: 30000 })
  }
}

export default OnlyOffice
