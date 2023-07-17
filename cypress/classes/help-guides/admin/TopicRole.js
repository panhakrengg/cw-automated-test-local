import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'

class TopicRole {
  _itcModify = new InterceptReq('/help_guide/options/get', 'Modify')

  initColumnName() {
    cy.get('td').eq(0).as('name')
    cy.get('td').eq(1).as('articles')
  }
  interceptModify() {
    this._itcModify.set()
  }
  waitModify() {
    this._itcModify.wait()
  }
  setThenWaitModify() {
    this.interceptModify()
    this.waitModify()
  }
  inputName(title) {
    cy.swal2().within(($popup) => {
      cy.inputByPlaceholder(Field.NAME, title)
    })
  }
  inputThenCreate(title) {
    this.inputName(title)
    this.clickCreate()
    this.waitModify()
  }
  inputNameThenSave(title) {
    this.inputName(title)

    cy.swal2().within(($popup) => {
      cy.clickPrimaryButton(Field.SAVE)
    })
    this.setThenWaitModify()
  }
  clickTopicRoleName(name) {
    cy.cwTable()
      .rowName(name)
      .within(($topicRow) => {
        cy.wrap($topicRow).find('.cursor-pointer').click({ force: true })
        cy.wrap($topicRow)
          .find('td')
          .eq(1)
          .then(($article) => {
            return $article.text().trim()
          })
      })
  }
  topicRoleCheckTotalArticle(name, total) {
    cy.get('td').eq(0).contains(name)
    cy.get('td').eq(1).contains(total)
  }
  clickCreate() {
    this.interceptModify()
    cy.swal2().clickPrimaryButton(Field.CREATE)
  }

  verifyCreateNewPopup(popupName) {
    cy.swal2().within(($swal2) => {
      cy.getSwal2Header().should('have.text', `Create New ${popupName}`)
      cy.wrap($swal2)
        .getSwal2Content()
        .within(($swal2Content) => {
          cy.wrap($swal2Content).find('label').should('contain.text', Field.NAME)
          cy.wrap($swal2Content).find('input').should('to.be', 'visible')
          cy.wrap($swal2Content).buttonDisabled().contains(Field.CREATE)
        })
    })
  }
  verifyEditPopup(popupName, topicRoleName) {
    cy.swal2().within(($swal2) => {
      cy.getSwal2Header().should('have.text', `Edit ${popupName}`)
      cy.wrap($swal2)
        .getSwal2Content()
        .within(($swal2Content) => {
          cy.wrap($swal2Content).find('label').should('contain.text', Field.NAME)
          cy.wrap($swal2Content)
            .find('input')
            .should('to.be', 'visible')
            .should('have.value', topicRoleName)
          cy.wrap($swal2Content).buttonDisabled().contains(Field.SAVE)
        })
    })
  }
}
export default TopicRole
