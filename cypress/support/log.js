/* ----------Log Background Color---------- */
const style = document.createElement('style')
style.textContent = `
      li.command.command-name-log > div > span > div > span.command-info {
       background-color: #1f883d !important;
      }
      li.command.command-name-log > div > span > div > span.command-info > span.command-message > span {
        color: #ffffff !important;
        font-weight: bold !important;
      }
`
const getHeadHTML = () => Cypress.$(window.top.document.head)
const headHTML = getHeadHTML()
headHTML.append(style)
/*-----------------END---------------------*/

Cypress.Commands.add('logCwNode', (email) => {
  cy.get('meta[name="environment"]', { log: false })
    .invoke('attr', 'content')
    .as('nodeContent')
    .then(($node) => {
      cy.log(`Login with email ${email} on Node:${$node}`)
    })
})

Cypress.Commands.add('logInTestCase', (value) => {
  cy.log(`***** ${value} *****`)
})
