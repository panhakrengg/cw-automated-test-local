class NodeChecker {
  _node

  setNode() {
    this.getNode().then(($node) => {
      this._node = $node
    })
  }

  getNode() {
    return cy.get('@nodeContent')
  }

  isDifferentNodeAndLog() {
    cy.get('@nodeContent').then(($node) => {
      const isDifferent = $node != this._node
      if (isDifferent) {
        cy.log('Skip checking the result because different Node.')
      }
      cy.wrap(isDifferent).as('isDifferent')
    })
    return cy.get('@isDifferent')
  }
}

export default NodeChecker
