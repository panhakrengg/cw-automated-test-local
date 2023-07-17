import YamlHelper from '../../classes/utilities/YamlHelper'
const defaultStubAllCategories = 'stubAllCategories'
const defaultStubCategory = 'stubCategory'
const defaultStubDiscussion = 'stubDiscussion'
const defaultStubThread = 'stubThread'

Cypress.Commands.add('stubDiscussion', (yamlName, alias = defaultStubDiscussion) => {
  cy.wrap('null', { log: false }).as(alias)
  new YamlHelper(yamlName).read().then(({ DiscussionInfo }) => {
    cy.wrap(DiscussionInfo).as(alias)
  })
})

Cypress.Commands.add('stubThread', (yamlName, thread, alias = defaultStubThread) => {
  cy.wrap('null', { log: false }).as(alias)
  new YamlHelper(yamlName).read().then(({ DiscussionInfo }) => {
    cy.wrap(DiscussionInfo.threads[thread]).as(alias)
  })
})

Cypress.Commands.add(
  'stubAllDiscussionCategories',
  (yamlName, alias = defaultStubAllCategories) => {
    cy.wrap('null', { log: false }).as(alias)
    new YamlHelper(yamlName).read().then(({ DiscussionInfo }) => {
      cy.wrap(DiscussionInfo.categories).as(alias)
    })
  }
)

Cypress.Commands.add(
  'stubDiscussionCategory',
  (yamlName, category, alias = defaultStubCategory) => {
    cy.wrap('null', { log: false }).as(alias)
    new YamlHelper(yamlName).read().then(({ DiscussionInfo }) => {
      cy.wrap(DiscussionInfo.categories[category]).as(alias)
    })
  }
)
