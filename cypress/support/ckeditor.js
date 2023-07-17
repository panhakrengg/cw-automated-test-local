let aliasToolBar = 'editorToolBar'

const defaultEditorAlias = 'cwEditor'
Cypress.Commands.add('typeInEditor', (text, alias = defaultEditorAlias) => {
  cy.get('iframe.cke_wysiwyg_frame')
    .invoke('contents')
    .find('body.cw-editor.cke_editable.cke_editable_themed.cke_contents_ltr', {
      timeout: 30000,
    })
    .as(alias)
    .type(`${text}`, { force: true })
})

Cypress.Commands.add('clearTextEditor', () => {
  cy.get('iframe.cke_wysiwyg_frame').then(($iframe) => {
    const $body = $iframe
      .contents()
      .find('body.cw-editor.cke_editable.cke_editable_themed.cke_contents_ltr')
    cy.wrap($body).clear({ force: true })
  })
})

Cypress.Commands.add('editorElementContain', (element, text, index = 0) => {
  cy.get('.cke_wysiwyg_frame')
    .eq(index)
    .then(($iframe) => {
      const $body = $iframe
        .contents()
        .find('body.cw-editor.cke_editable.cke_editable_themed.cke_contents_ltr')
      cy.wrap($body, { timeout: 15000 }).as('editorElement')
    })
  return cy.get('@editorElement').contains(element, text)
})

Cypress.Commands.add('editorBodyContain', (text, index = 0) => {
  cy.get('.cke_wysiwyg_frame')
    .eq(index)
    .then((iframe) => cy.wrap(iframe.contents()[0]).as('editorBody'))
  return cy
    .get('@editorBody')
    .its('activeElement.innerText')
    .invoke('replace', /\s/g, ' ') //Replace whitespace from string with normal space
    .should('contain', text)
})

Cypress.Commands.add('getEditorToolBar', { prevSubject: 'optional' }, (subject, aliasToolBar) => {
  if (subject) {
    cy.wrap(subject).get('.cke_top').find('.cke_toolbox').first().as(aliasToolBar)
  }
})

Cypress.Commands.add(
  'verifyEditorToolBar',
  { prevSubject: 'optional' },
  (subject, hasNoImageSelector) => {
    if (subject) {
      cy.wrap(subject).getEditorToolBar(aliasToolBar)
      cy.get('@' + aliasToolBar).within(($tool) => {
        cy.wrap($tool).find('.cke_combo__format').contains('Format')
        cy.wrap($tool).find('.cke_toolgroup').as('toolGroup')
      })
      cy.get('@toolGroup')
        .eq(0)
        .within(($button) => {
          cy.wrap($button).find('a').should('have.length', '3')
          cy.wrap($button).find('.cke_button__bold').should('be.visible')
          cy.wrap($button).find('.cke_button__italic').should('be.visible')
          cy.wrap($button).find('.cke_button__underline').should('be.visible')
        })
      cy.get('@toolGroup')
        .eq(1)
        .within(($list) => {
          cy.wrap($list).find('a').should('have.length', '2')
          cy.wrap($list).find('.cke_button__numberedlist').should('be.visible')
          cy.wrap($list).find('.cke_button__bulletedlist').should('be.visible')
        })
      cy.get('@toolGroup')
        .eq(2)
        .within(($link) => {
          cy.wrap($link).find('a').should('have.length', '2')
          cy.wrap($link).find('.cke_button__link').should('be.visible')
          cy.wrap($link).find('.cke_button__unlink').should('be.visible')
        })
      if (!hasNoImageSelector) {
        cy.get('@toolGroup')
          .eq(3)
          .within(($image) => {
            cy.wrap($image).find('a').should('have.length', '1')
            cy.wrap($image).find('.cke_button__imageselector').should('be.visible')
          })
      }
    }
  }
)

Cypress.Commands.add(
  'hasTextEditor',
  { prevSubject: 'optional' },
  (subject, element = '.cke_wysiwyg_frame') => {
    const wrapper = subject ? cy.wrap(subject) : cy
    wrapper.get(element).getIframeBody().should('be.visible')
  }
)

Cypress.Commands.add(
  'ckEditorHasContent',
  { prevSubject: 'optional' },
  (subject, text, imageName, element = '.cke_wysiwyg_frame') => {
    const wrapper = subject ? cy.wrap(subject) : cy
    wrapper
      .get(element)
      .getIframeBody()
      .within(($body) => {
        if (text) cy.wrap($body).should('contain.text', text).and('be.visible')
        if (imageName)
          cy.get('.cke_widget_image > img')
            .invoke('attr', 'src')
            .then(($src) => {
              expect($src).to.contain(imageName)
            })
      })
  }
)

Cypress.Commands.add('openImageSelectorPopup', () => {
  cy.get('.cw-editor .cke_browser_webkit').within(($editor) => {
    cy.wrap($editor)
      .get('.cke_button.cke_button__imageselector')
      .should('be.visible')
      .wait(3000)
      .click()
    cy.wait(3000)
  })
})

Cypress.Commands.add('uploadImageToRTE', (filePath, haveSelectFileButton = false) => {
  cy.openImageSelectorPopup()
  cy.get('iframe[title="Select Item"]')
    .getIframeBody()
    .within(($iframeBody) => {
      cy.wrap($iframeBody)
        .find('#main-content')
        .within(() => {
          cy.get('.drop-enabled').within(() => {
            cy.intercept('POST', '**%2Fdocument_library%2Fupload_file_entry**').as('uploadFile')
            if (haveSelectFileButton) {
              cy.wait(1000)
              cy.getElementWithLabel('Select File', 'label').click({ force: true })
            }
            cy.get('input[type="file"].input-file').selectFile(`cypress/fixtures/${filePath}`, {
              force: true,
            })
            cy.wait('@uploadFile')
          })
          cy.get('.item-selector-preview-container').within(() => {
            cy.clickPrimaryButton('Add')
          })
        })
    })
})

Cypress.Commands.add('clickImageInImageSelector', (imageTitle) => {
  cy.openImageSelectorPopup()
  cy.get('iframe[title="Select Item"]')
    .getIframeBody()
    .within(($iframeBody) => {
      cy.wrap($iframeBody)
        .find('#main-content')
        .parent()
        .within(($sufaceDefault) => {
          cy.wrap($sufaceDefault)
            .get(
              '#_com_liferay_item_selector_web_portlet_ItemSelectorPortlet_repositoryEntriesSearchContainerSearchContainer'
            )
            .wait(3000) // wait for iframe element is ready
            .find(`.entry-card .card-interactive span[title='${imageTitle}']`)
            .parents('.card-type-asset')
            .click()
        })
    })
    .then(() => {
      cy.get('.liferay-modal').should('not.exist')
    })
})

Cypress.Commands.add('textEditorExist', (element) => {
  element.within(($ele) => {
    cy.wrap(
      $ele.find('body.cw-editor.cke_editable.cke_editable_themed.cke_contents_ltr').length > 0
    ).as('textEditorExist')
  })
  return cy.get('@textEditorExist')
})
