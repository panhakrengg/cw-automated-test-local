class LearningQueries {
  getLearningUrl() {
    return `/u/home/learnings`
  }

  getFilterToggle(type) {
    return cy.get(`.nav-nested-container span:contains("${type}")`).parent()
  }

  getFilterItemsWrapper(type) {
    return this.getFilterToggle(type).siblings('.collapse-wrapper')
  }

  getTotalFilterItemsByCategoryType(type) {
    this.getFilterItemsWrapper(type)
      .find('.collapse-element > .checkbox-wrapper')
      .then(($item) => {
        cy.wrap($item.length).as('totalItems')
      })
    return cy.get('@totalItems')
  }
}

export default LearningQueries
