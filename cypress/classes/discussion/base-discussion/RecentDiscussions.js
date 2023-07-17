class RecentDiscussions {
  /* Query */
  #getRecentDiscussions() {
    return cy.get('.discussion-updates')
  }

  /* Assertions */
  verifyThreadVisibleWith(subjects = []) {
    this.#getRecentDiscussions()
      .scrollIntoView()
      .within(() => {
        subjects.forEach((subject) => {
          cy.get(`.thread-title:contains("${subject}")`).should('be.visible')
        })
      })
  }

  verifyThreadNotExistWith(subjects = []) {
    this.#getRecentDiscussions().within(() => {
      subjects.forEach((subject) => {
        cy.get(`.thread-title:contains("${subject}")`).should('not.exist')
      })
    })
  }
}

export default RecentDiscussions
