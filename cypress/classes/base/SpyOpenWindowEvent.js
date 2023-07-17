class SpyOpenWindowEvent {
  setSpy() {
    cy.window().then((win) => {
      cy.stub(win, 'open')
    })
  }
  getUrl() {
    cy.window()
      .its('open')
      .then((fetchSpy) => {
        const url = fetchSpy.args[0][0]
        cy.wrap(url).as('url')
      })
    return cy.get('@url')
  }
}

export default SpyOpenWindowEvent
