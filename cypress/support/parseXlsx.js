Cypress.Commands.add('parseXlsx', (inputFile) => {
  return cy.task('parseXlsx', { filePath: inputFile })
})
Cypress.Commands.add('parseCsv', (inputFile) => {
  return cy.task('parseCsv', { filePath: inputFile })
})
