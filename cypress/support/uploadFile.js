Cypress.Commands.add('uploadFile', (filePath, intercept) => {
  intercept.set()
  cy.get(`.cw-dropzone-file`).selectFile(`cypress/fixtures/${filePath}`, {
    force: true,
  })
  intercept.wait()
})

Cypress.Commands.add('changeImage', (filePath) => {
  cy.get('input[type="file"].hide').selectFile(`cypress/fixtures/${filePath}`, { force: true })
})
