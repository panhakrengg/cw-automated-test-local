Cypress.Commands.add(
'dragdropElement',
{ prevSubject: 'optional' },
  (subject, clientX, clientY, index) => {
    if (subject) {
      cy.wrap(subject).dragdrop(clientX, clientY, index)
    } else {
      cy.dragdrop(clientX, clientY, index)
    }
  }
)

Cypress.Commands.add(
'dragdrop', (clientX, clientY, index) => {
  cy.get('.dragdrop').eq(index)
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: clientX, clientY: clientY })
    .trigger('mouseup', { force: true })
  }
)

Cypress.Commands.add(
  'getDragDropThumbnail',
  { prevSubject: 'optional' },
  (subject) => {
    if (subject) {
      return cy.wrap(subject).get('.cw-dropzone-has-thumbnail')
    } else {
      return cy.get('.cw-dropzone-has-thumbnail')
    }
  }
)

Cypress.Commands.add(
  'verifyDragDropThumbnail',
  { prevSubject: 'optional' },
  (subject, title, supportFile, maxSize) => {
    if (subject) {
      cy.wrap(subject)
        .getDragDropThumbnail()
        .within(($dragDrop) => {
          cy.wrap($dragDrop).find('span').contains(title)
          cy.wrap($dragDrop)
            .find('small')
            .eq(0)
            .contains('Supported files: ' + supportFile)
          cy.wrap($dragDrop).find('button').contains('Select File')
          cy.wrap($dragDrop)
            .find('small')
            .eq(1)
            .contains('Maximum size ' + maxSize)
        })
    }
  }
)

Cypress.Commands.add(
  'dropVideoFile',
  { prevSubject: 'optional' },
  (subject, fileName) => {
    if (subject) {
      cy.fixture('attachments/' + fileName, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) => {
          cy.wrap(subject).get('input.cw-dropzone-file').attachFile({
            fileContent,
            fileName: fileName,
            mimeType: 'video/mp4',
            encoding: 'utf8',
          })
        })
    }
  }
)

Cypress.Commands.add(
  'verifyDropZoneArea',
  (label, btnLabel = 'Select Files') => {
    cy.get('.cw-dropzone').within(($dropzone) => {
      cy.wrap($dropzone)
        .should('have.class', 'border')
        .and('have.class', 'border-style-dash')
      cy.get('.cw-dropzone-content')
        .contains(label)
        .should('be.visible')
        .find('button', btnLabel)
        .should('be.visible')
      cy.get('.cw-dropzone-drop-area > input[type="file"]').should(
        'not.be.visible'
      )
    })
  }
)
