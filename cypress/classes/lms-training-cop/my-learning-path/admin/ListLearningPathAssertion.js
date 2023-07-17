import Field from '../../../constants/Field'

class ListLearningPathAssertion {
  aliasLearningItem = 'learningItem'

  verifyLearningPathItem(learningItem, shouldCreatedByMe = false) {
    const aliasItem = `@${this.aliasLearningItem}`
    cy.get(aliasItem).within(($item) => {
      cy.wrap($item)
        .get(`img[alt="${learningItem.name}"]`)
        .scrollIntoView()
        .cwImageRestResponseSuccess()
      if (shouldCreatedByMe) {
        cy.wrap($item).get('span.badge-success').should('contain', 'CREATED BY ME')
      } else {
        cy.wrap($item).should('not.have.class', 'badge-success')
      }
      cy.wrap($item).get('span.subtitle-learning-path').should('contain', 'Learning Path')
      cy.wrap($item)
        .get('div.course-items.d-none > .d-flex')
        .as(`courseItems${this.aliasLearningItem}`)
    })
  }

  expectLabelCourseOptional(courseItem) {
    if (courseItem.optional) {
      cy.get('@courseItem').get('em').should('contain', 'Mandatory Course')
    } else {
      cy.get('@courseItem').get('em').should('contain', 'Course')
    }
  }

  expectShowCourseItem(courseItem, orderIndex) {
    const aliasCourseItem = `@courseItems${this.aliasLearningItem}`
    cy.get(aliasCourseItem).eq(orderIndex).as('courseItem')
    cy.get('@courseItem').should('contain', courseItem.name)
    this.expectLabelCourseOptional(courseItem)
  }

  verifyThreeDots() {
    cy.get('@cwDropDownList').eq(0).should('contain', Field.OVERVIEW)
    cy.get('@cwDropDownList').eq(1).should('contain', Field.EDIT)
    cy.get('@cwDropDownList').eq(2).should('contain', 'Add Course')
    cy.get('@cwDropDownList').eq(3).should('contain', 'Manage People')
    cy.get('@cwDropDownList').eq(4).should('contain', Field.DELETE)
  }

  verifyDeleteLearningPath() {
    cy.get('@cwDropDownList').verifySwal2Confirmation(
      'Would you like to delete this learning path?',
      'Note: All data in this learning path will be deleted. This action cannot be undone.',
      Field.YES_DELETE
    )
  }

  expectMyLearningPathList() {
    cy.get('.learning-path-list__wrapper .learning-path-item')
      .its('length')
      .should('be.greaterThan', 0)
  }

  expectHasMyLearningTotalCount() {
    cy.expectTotalCount('My Learning Paths')
  }

  expectHasAllLearningTotalCount() {
    cy.expectTotalCount('All Learning Paths')
  }
  expectDefaultSortBy(selected = 'Latest Update') {
    cy.get('.learning-path-control.d-none .dropdown-toggle > span.pr-5').should(
      'contain',
      `Sort by: ${selected}`
    )
  }
}

export default ListLearningPathAssertion
