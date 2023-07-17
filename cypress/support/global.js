Cypress.Commands.add('getSearchGlobal', () => {
  return cy.get('.cw-navigation__search input[placeholder="Search"]')
})
Cypress.Commands.add('searchGlobal', (keywords) => {
  cy.waitPortletReady()
  cy.getSearchGlobal().type(`${keywords} {enter}`)
  cy.wait(1000)
})
Cypress.Commands.add('clearSearchGlobal', () => {
  cy.getSearchGlobal().clear()
})
Cypress.Commands.add('showEmptySearchResult', (keywords) => {
  const suggestionOptions = [
    'Make sure keywords are spelled correctly.',
    'Try different search terms.',
    'Use more general search terms.',
    'Try changing filters.',
  ]

  cy.get('div#main-content')
    .first()
    .within(($content) => {
      const emptyResultMsgRoot = $content.find('div.empty-result.d-sm-flex').length
        ? 'div.empty-result.d-sm-flex'
        : 'div.empty-result-message'
      const emptyResultMsg = $content.find('.empty-result-message').length
        ? '.empty-result-message'
        : '.empty-result-message-message'
      const emptyResultSuggestion = $content.find('.empty-result-suggestion').length
        ? '.empty-result-suggestion'
        : '.empty-result-message-text'
      const emptyResultImage = $content.find('.empty-result-image').length
        ? '.empty-result-image'
        : '.empty-result-message-image'

      cy.get(emptyResultMsgRoot).within(() => {
        cy.contains(emptyResultMsg, `We’re sorry. No results were found for “${keywords}”`).should(
          'be.visible'
        )
        cy.contains(emptyResultSuggestion, 'Search suggestions:')
          .should('be.visible')
          .within(() => {
            suggestionOptions.forEach((message) => {
              cy.contains('li', message).should('be.visible')
            })
          })
        cy.get(emptyResultImage)
          .invoke('css', 'background-image')
          .then(($background) => {
            console.log($background)
            expect($background).to.include(
              '/o/cw-cec-theme/images/emoticons/sad_search_results.gif'
            )
          })
      })
    })
})
