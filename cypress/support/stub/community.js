import YamlHelper from '../../classes/utilities/YamlHelper'
const defaultStubCommunity = 'stubCommunity'
const defaultStubQuickPost = 'stubQuickPost'

Cypress.Commands.add('stubCommunity', (yamlName, community, alias = defaultStubCommunity) => {
  cy.wrap('null', { log: false }).as(alias)
  new YamlHelper(yamlName).read().then(({ Communities }) => {
    cy.wrap(Communities[community]).as(alias)
  })
})

Cypress.Commands.add('stubQuickPost', (yamlName, quickPost, alias = defaultStubQuickPost) => {
  cy.wrap('null', { log: false }).as(alias)
  new YamlHelper(yamlName).read().then(({ QuickPosts }) => {
    cy.wrap(QuickPosts[quickPost]).as(alias)
  })
})
