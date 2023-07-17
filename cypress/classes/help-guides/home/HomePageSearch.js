import HelpGuidesHome from './HelpGuidesHome'

class HomePageSearch extends HelpGuidesHome {
  topic = `topic`
  role = `role`

  closeDropDown(subject) {
    cy.get(subject).scrollIntoView().click()
  }

  selectTopicFilter(tagName) {
    cy.get('@topicsDropdown').clickDropdownName(tagName)
  }

  selectRoleFilter(tagName) {
    cy.get('@rolesDropdown').clickDropdownName(tagName)
  }

  clickRoleDropDown() {
    cy.get('@rolesDropdown').click()
  }

  clickTopicDropdown() {
    cy.get('@topicsDropdown').click()
  }

  expectTotalSelectedTopics(selectedFilter) {
    const TOPICS = 'Topics'
    cy.get('@topicsDropdown')
      .children()
      .contains(`${TOPICS}`)
      .should('contain.text', `${TOPICS} (${selectedFilter} selected)`)
  }

  expectTotalSelectedRoles(selectedFilter) {
    const ROLES = 'Roles'
    cy.get('@rolesDropdown')
      .children()
      .contains(`${ROLES}`)
      .should('contain.text', `${ROLES} (${selectedFilter} selected)`)
  }

  clickClearFilter() {
    cy.get('@clearFilterButton').click()
  }

  topicTag(tagName) {
    this.selectTopicFilter(tagName)
    this.waitSearchArticle()
  }

  roleTag(tagName) {
    this.selectRoleFilter(tagName)
    this.waitSearchArticle()
  }

  roleTags(tagNames) {
    tagNames.forEach((tagName) => {
      this.selectRoleFilter(tagName)
      this.waitSearchArticle()
    })
  }

  expectTotalRenderArticles(total) {
    this.waitSearchArticle()
    cy.get('#_helpGuidePortlet_helpGuide > .row > div .card-body').should('have.length', total)
  }

  scrollToViewMoreArticles() {
    cy.get('#_helpGuidePortlet_helpGuide > .row > div').then(($articles) => {
      const lastArticlePosition = $articles.length - 1
      cy.get($articles).eq(lastArticlePosition).scrollIntoView({ duration: 3000 })
    })
  }
}

export default HomePageSearch
