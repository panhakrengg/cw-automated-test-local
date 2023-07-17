import ManageCommunity from './ManageCommunity'
import Field from '../constants/Field'

class CommunityHome extends ManageCommunity {
  clickMiniPost() {
    cy.get('#_quickPostPortlet_quickPost > .cursor-pointer').click()
  }
  initPopupMiniPostElement() {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup).getPopupBody().as('postBody')
    })
  }
  fillInMiniPostWith(Content) {
    this.initPopupMiniPostElement()
    cy.get('@postBody').within(() => {
      cy.typeInTextareaByPlaceholder('Share your update here.', Content)
    })
  }
  clearMiniPostContent() {
    this.initPopupMiniPostElement()
    cy.get('@postBody').within(() => {
      cy.clearTextareaByPlaceholder('Share your update here.')
    })
  }
  clickButtonSubmitMiniPostBy(name) {
    this._itcFetchPosts.set()
    cy.getPopup().within(($popup) => {
      cy.wrap($popup).getPopupFooter().btnConfirm(name).click()
    })
    this._itcFetchPosts.wait()
  }
  clickButtonPost() {
    this.clickButtonSubmitMiniPostBy('Post')
  }
  clickButtonUpdatePost() {
    this.clickButtonSubmitMiniPostBy(Field.UPDATE)
  }
  addNewMiniPost(content) {
    this.clickMiniPost()
    this.fillInMiniPostWith(content)
    this.clickButtonPost()
  }
  getMiniPostElement(content) {
    cy.get('.cec-card__content').then(() => {
      cy.getElementWithLabel(content, 'p').parents('.cec-card--activity-post').as('miniPost')
    })
  }
  removeMiniPost(content) {
    this.getMiniPostElement(content)
    this.clickMiniPostThreeDotBy('Delete Post')
    this.confirmDeleteMiniPost()
  }
  confirmDeleteMiniPost() {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).swal2Confirm(Field.YES_REMOVE).click()
    })
  }
  clickMiniPostThreeDotBy(item) {
    cy.get('@miniPost').within(() => {
      cy.getThreeDots().click()
      cy.get('@cwThreeDots').clickDropdownName(item)
    })
  }
  editMiniPost(oldContent, newContent) {
    this.getMiniPostElement(oldContent)
    this.clickMiniPostThreeDotBy('Edit Post')
    this.clearMiniPostContent()
    this.fillInMiniPostWith(newContent)
    this.clickButtonUpdatePost()
  }
  clickShareIcon(content) {
    this.getMiniPostElement(content)
    cy.get('@miniPost').within(() => {
      cy.get('.cec-card__action').eq(2).find('a').should('be.visible').click()
    })
  }
  getFirstCopNameInSharePostPopup() {
    cy.swal2().within(() => {
      cy.get('.post-sharing-scope__wp-wrapper .cop-item').first().as('firstCop')
    })
    return cy.get('@firstCop').find('label > span').invoke('text')
  }
  selectShareCopBy(name) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(name, 'span').parents('.cursor-pointer').click()
      cy.btnConfirm(Field.NEXT).click()
    })
  }
  fillInShareThoughtAndPost() {
    cy.swal2().within(() => {
      cy.typeInTextareaByPlaceholder('Share your thoughts', 'Share post for log activity track!')
      cy.btnConfirm('Post').click()
    })
  }
}

export default CommunityHome
