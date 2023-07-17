import Environment from '../../../base/Environment'
import QuickTip from '../../../components/QuickTip'

class LearningPathAssertion {
  #env = new Environment()
  btnSaveSelector = '.save-learning-path'
  quickTip = new QuickTip()

  expectSaveButtonDisable() {
    cy.get(this.btnSaveSelector).buttonDisabled()
  }

  expectSaveButtonEnable() {
    cy.get(this.btnSaveSelector).buttonNotDisabled()
  }

  expectSaveEnableAfterTypeTitle() {
    cy.get('p.font-size-22').should('contain', 'General Information')
    cy.inputByPlaceholder('Enter the title of the learning path', 'Au course')
    this.expectSaveButtonEnable()
  }

  expectShowCourseImageBanner() {
    cy.get('div.image-block').within(($imageBock) => {
      cy.wrap($imageBock).find('button.icon-upload-image')
      cy.wrap($imageBock).find('i').should('contain', 'Recommended banner size: 833 x 400 px')
    })
  }

  expectShowEditor() {
    cy.get('.pt-3 > p').should('contain', 'Learning Path Overview')
    cy.hasTextEditor()
  }

  expectShowDuration() {
    cy.get(`@inputMonth`).type(1)
    cy.get(`@inputDay`).type(23)
    cy.get(`@inputHour`).type(22)
    cy.get(`@inputMin`).type(59)
    cy.get(`@decreaseMin`).click()
    cy.get(`@increaseMin`).click()
  }

  expectLearningPathCompletion() {
    const index = this.#env.isPrd() ? 0 : 1
    cy.get('.font-size-24').should('contain', 'Learning Path Completion')
    cy.get('.edit-learning-path span.cw-toggle-button input').eq(1).as('toggleAllowAddingToProfile')
    cy.get('@toggleAllowAddingToProfile').should('have.attr', 'disabled')
  }

  expectShowQuickTip(quickTip) {
    this.quickTip.secondaryTitle(quickTip.title)
    const descriptionIndex = 1
    const addCoursesIndex = 2
    const addCategoriesIndex = 3
    const addMembersIndex = 4
    this.quickTip.desc(quickTip.desc[0])
    this.quickTip.desc(quickTip.desc[descriptionIndex])
    this.quickTip.desc(quickTip.desc[addCoursesIndex])
    this.quickTip.desc(quickTip.desc[addCategoriesIndex])
    this.quickTip.desc(quickTip.desc[addMembersIndex])
    this.quickTip.hasMoreTipsLink()
  }
}

export default LearningPathAssertion
