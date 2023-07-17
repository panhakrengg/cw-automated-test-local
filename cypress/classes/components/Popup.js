class Popup {
  static verifyPopupHeader(subject, title) {
    if (!subject) return
    return cy.wrap(subject)
      .getPopup()
      .getPopupHeader()
      .should('contain.text', title)
      .find('> a.btn')
      .should('have.css', 'cursor', 'pointer')
  }

  static verifyPopupFooter(subject, cancel, confirm) {
    if (!subject) return
    cy.wrap(subject)
      .getPopup()
      .getPopupFooter()
      .within(($footer) => {
        cy.wrap($footer)
          .find('button')
          .should('contain.text', cancel)
          .and('be.visible')
        cy.wrap($footer)
          .find('button')
          .should('contain.text', confirm)
          .and('be.disabled')
      })
  }
}

export default Popup
