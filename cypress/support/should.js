const getElement = (ele, attr) => {
  return attr ? ele.find(attr) : ele
}

Cypress.Commands.add('shouldExist', (element, attr) => {
  getElement(element, attr).should('exist')
})

Cypress.Commands.add('shouldNotExist', (element, attr) => {
  getElement(element, attr).should('not.exist')
})

Cypress.Commands.add('shouldNotHaveValue', (element, attr) => {
  getElement(element, attr).should('have.value', '')
})

Cypress.Commands.add('shouldNotEmpty', (element, attr) => {
  getElement(element, attr).should('not.be.empty')
})

Cypress.Commands.add('shouldVisible', (element, attr) => {
  getElement(element, attr).should('be.visible')
})

Cypress.Commands.add('shouldNotVisible', (element, attr) => {
  getElement(element, attr).should('not.be.visible')
})
