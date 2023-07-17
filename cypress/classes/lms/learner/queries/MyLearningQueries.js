class MyLearningQueries {
  getUrl() {
    return '/u/home/learnings'
  }

  getCardCourse(name) {
    return cy.getElementWithLabel(name, '.learning-path-course-overview')
  }

  getRowInstanceInPopup(name) {
    return cy.getElementWithLabel(name, 'ul.instance-list li')
  }

  getLinkWithdraw(instanceName) {
    this.getRowInstanceInPopup(instanceName).within(() => {
      cy.getLinksWithLabel('Withdraw').as('withdrawLink')
    })
    return cy.get('@withdrawLink')
  }

  getButtonWithdraw() {
    return cy.getButtonByName('Yes, Withdraw')
  }
}

export default MyLearningQueries
