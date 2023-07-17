import Learning from '../../Learning'
import Field from '../../../constants/Field'

class MyLearning {
  #learning = new Learning()

  /* Assertion */
  _verifyStatusDropdown(options = []) {
    cy.get('.learning-wrapper-title').within(($learningWrapper) => {
      options.forEach((option) => {
        cy.wrap($learningWrapper).getDropdownName(option).should('be.visible')
      })
    })
  }

  _verifyHeaderAndTotalCourses() {
    this.#learning.getCourses().then(($course) => {
      cy.get('div.font-size-22')
        .invoke('text')
        .then(($text) => {
          expect($text.trim()).to.equal(`My Learning (${$course.length})`)
        })
    })
  }

  _verifyCourseCardInMyLearning(course, buttonLabel = Field.START) {
    this.#learning.getCourseByName(course.name).within(() => {
      cy.get(`img[alt="CourseImage"]`)
        .should('exist')
        .invoke('attr', 'src')
        .then(($src) => {
          cy.isSuccessResponseImage($src)
        })
      cy.expectElementWithLabelVisible(course.name, 'h5 > a')
      cy.expectElementWithLabelVisible('Course', '.my-learning-type')
      cy.expectElementWithLabelVisible(course.courseOverview, 'p')
      cy.expectElementWithLabelVisible(buttonLabel, 'a')
      cy.get('.dropdown-three-dots')
        .last()
        .should('be.visible')
        .within(($threeDot) => {
          cy.wrap($threeDot).getDropdownName('View my courses').should('be.visible')
        })
    })
  }
}

export default MyLearning
