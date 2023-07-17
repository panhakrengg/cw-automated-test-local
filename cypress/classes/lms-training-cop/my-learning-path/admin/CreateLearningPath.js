class CreateLearningPath {
  init() {
    this.getDuration()
    this.getBtnBack()
  }
  getBtnBack() {
    cy.get('div.back-block').as('backButton')
  }
  getDuration() {
    cy.get('div.duration').find('input').eq(0).as('inputMonth')
    cy.get('div.duration').find('input').eq(1).as('inputDay')
    cy.get('div.hour-block').find('input').eq(0).as('inputHour')
    cy.get('div.hour-block').find('input').eq(1).as('inputMin')
    cy.get('div.minute-icon').find('span.glyphicon-triangle-top').as('increaseMin')
    cy.get('div.minute-icon').find('span.glyphicon-triangle-bottom').as('decreaseMin')
  }
  clickBack() {
    cy.get('@backButton').click()
  }
}

export default CreateLearningPath
