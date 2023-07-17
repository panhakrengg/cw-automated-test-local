import InterceptReq from '../../base/InterceptReq'
import Discussion from '../../constants/Discussion'
import Field from '../../constants/Field'
import LmsAdminIntercept from '../../lms/admin/interception/LmsAdminIntercept'
import BaseDiscussion from '../base-discussion/BaseDiscussion'
import InterceptDiscussion from '../base-discussion/InterceptDiscussion'

class ManageDiscussion extends BaseDiscussion {
  #itcFindExcludeCategories = new InterceptReq(
    '/forum/categories/find_exclude',
    'FindExcludeCategories'
  )

  constructor() {
    super()
  }
  removeCategoryIfExists(name) {
    InterceptDiscussion.itcSearchCategory.set()
    this.search(name)
    InterceptDiscussion.itcSearchCategory.wait()
    cy.wait(1000)
    cy.get('.cec-card__body--full-width').within(($card) => {
      if ($card.find(`.taglib-empty-result-message`).length === 0) {
        this.getItemBySubject(name, 'a')
          .within(($category) => {
            cy.wrap($category).clickDropdownItem(Field.REMOVE)
          })
          .as('item')
        cy.get('@item').swal2().swal2Confirm(Field.YES_REMOVE).click()
      }
    })
  }
  createNewCategory(name, description) {
    this._getNewCategoryButton().click()
    InterceptDiscussion.itcEditCategory.set()
    cy.get('.create-category-wrapper').within(() => {
      this._getCategoryNameInput().clear().type(name)
      this._getCategoryDescriptionInput().clear().type(description)
      cy.btnConfirm(Field.PUBLISH).first().click()
    })
    InterceptDiscussion.itcEditCategory.wait()
  }
  expectCategoryIsSubscribed(name, elem = 'span') {
    this.getItemBySubject(name, elem).within(($category) => {
      cy.wrap($category)
        .getDropdownList()
        .should('contain.text', Field.UN_SUBSCRIBE)
        .and('be.visible')
    })
  }
  expectCategoryIsInSubscribedCategories(name) {
    cy.get('.category-section').within(() => {
      cy.getElementWithLabel(name, 'a').should('be.visible')
    })
  }
  resetCategoryInfoIfExists(oldName, newName, newDescription) {
    cy.get('.cec-card__body--full-width').then(($section) => {
      if ($section.find(`a.subject:contains(${oldName})`).length) {
        this.updateCategory(oldName, newName, newDescription, $section)
        InterceptDiscussion.itcFindCategories.set()
        cy.getElementWithLabel('Back', 'span').parent().click()
        InterceptDiscussion.itcFindCategories.wait()
      }
    })
  }
  updateCategory(oldName, newName, newDescription, $section) {
    this.#itcFindExcludeCategories.set()
    const $elem = $section
      ? cy.wrap($section).parentsUntil('.forum-wrapper')
      : cy.get('.category-section')

    $elem.then(() => {
      this.getItemBySubject(oldName, 'a').within(($category) => {
        cy.wrap($category).clickDropdownItem(Field.EDIT)
      })
    })
    this.#itcFindExcludeCategories.wait()
    InterceptDiscussion.itcFetchCategory.set()
    cy.get('.create-category-wrapper').within(() => {
      this._getCategoryNameInput().clear().type(newName)
      this._getCategoryDescriptionInput().clear().type(newDescription)
      cy.btnConfirm(Field.UPDATE).first().click()
    })
    InterceptDiscussion.itcFetchCategory.wait()
  }
  expectCategoryIsUpdated(name, description, threadName) {
    cy.get('.thread-wrapper').then(() => {
      cy.getElementWithLabel(name, 'span').should('be.visible')
      cy.getElementWithLabel(description, 'p').should('be.visible')
    })
    cy.get('.thread-section').within(() => {
      this.getItemBySubject(threadName, 'a').within(($thread) => {
        cy.getElementWithLabel('posted in', 'i').should('be.visible')
        cy.getElementWithLabel(name, 'span').should('be.visible')
      })
    })
  }
  resetCategoryToParentIfNotExist(parentCategory, categoryToMove) {
    this._getCategorySection().then(($section) => {
      if ($section.find(`a.subject:contains(${categoryToMove})`).length) {
        this.moveCategory(parentCategory, categoryToMove, parentCategory)
      }
    })
  }
  moveCategory(parentCategory, categoryToMove, newCategory) {
    if (newCategory === Discussion.NONE) {
      InterceptDiscussion.itcFindCategories.set()
      this._getCategorySection().within(() => {
        cy.clickLinkByName(parentCategory)
      })
      InterceptDiscussion.itcFindCategories.wait()
    }

    InterceptDiscussion.itcFindExcludeCategories.set()
    this._getCategorySection().within(() => {
      this.getItemBySubject(categoryToMove, 'a').within(($category) => {
        cy.wrap($category).clickDropdownItem(Field.MOVE)
      })
    })
    InterceptDiscussion.itcFindExcludeCategories.wait()

    InterceptDiscussion.itcMoveCategory.set()
    cy.swal2().within(($swal2) => {
      cy.getSwal2Header().should('have.text', Discussion.MOVE_CATEGORY)
      cy.getSwal2Content().within(($content) => {
        cy.wrap($swal2).clickVueTreeSelect()
        cy.wrap($swal2).clickVueTreeSelectOption(newCategory)
        cy.wrap($swal2).btnConfirm(Discussion.MOVE).click()
      })
    })
    InterceptDiscussion.itcMoveCategory.wait()
  }
  expectNotToFindCategoryInParentCategory(categoryName) {
    InterceptDiscussion.itcFindCategories.set()
    InterceptDiscussion.itcFindCategories.wait()
    this._getCategorySection().within(() => {
      cy.getElementWithLabel(categoryName, 'a').should('not.exist')
    })
  }
  expectCategoryToFindInAllCategoryList(categoryName) {
    this._getCategorySection().within(() => {
      cy.getElementWithLabel(categoryName, 'a').should('be.visible')
    })
  }
  removeThreadIfExists(threadName) {
    this.setThreadSubject(threadName)

    cy.get('#recentThread').within(($recentThread) => {
      if ($recentThread.find(`a.subject:contains(${threadName})`).length) {
        this.getThreadViaSubject('a.subject')
          .within(($thread) => {
            cy.wrap($thread).clickDropdownItem(Field.REMOVE)
          })
          .as('item')
        InterceptDiscussion.itcRemoveThread.set()
        cy.get('@item').swal2().swal2Confirm(Field.YES_REMOVE).click()
        InterceptDiscussion.itcRemoveThread.wait()
      }
    })
  }
  removeMyThreadIfExist(threadName) {
    InterceptDiscussion.itcFetchMyThreads.set()
    this.clickLeftSideBarBy(Discussion.MY_THREADS)
    InterceptDiscussion.itcFetchMyThreads.wait()

    this.removeThreadIfExists(threadName)
  }
  createNewThread(threadName) {
    this._getNewThreadButton().click()
    this._getThreadNameInput().clear().type(threadName)
    cy.wait(500)
    this.clickPublishButton()
  }
  createNewThreadUnderCategory(threadName, categoryName, subject) {
    this._getNewThreadButton().click()
    this._getThreadNameInput(subject).clear().type(threadName)
    cy.get('.create-thread-wrapper').within(($wrapper) => {
      cy.wrap($wrapper).clickVueTreeSelect()
      cy.wrap($wrapper).clickVueTreeSelectOption(categoryName)
    })
    cy.wait(500)
    this.clickPublishButton()
  }
  expectThreadIsSubscribed(threadName) {
    this.setThreadSubject(threadName)
    this.getThreadViaSubject('a.subject').within(($thread) => {
      cy.wrap($thread)
        .getDropdownList()
        .should('contain.text', Discussion.UNSUBSCRIBE)
        .and('be.visible')
    })

    InterceptDiscussion.FetchSubscribedThreads.set()
    this.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
    InterceptDiscussion.FetchSubscribedThreads.wait()

    cy.getElementWithLabel('Subscribed Threads', 'span')
      .parent()
      .next()
      .within(() => {
        cy.getElementWithLabel(threadName, 'a').should('be.visible')
      })
  }
  expectThreadIsNotSubscribed(threadName) {
    this.setThreadSubject(threadName)
    this.getThreadViaSubject('a.subject').within(($thread) => {
      cy.wrap($thread)
        .getDropdownList()
        .should('contain.text', Discussion.SUBSCRIBE)
        .and('be.visible')
    })
  }
  expectCategoryExists(name) {
    cy.get('.category-detail').within(() => {
      cy.getElementWithLabel(name, 'span').should('be.visible')
    })
  }
  assignFacilitator(name) {
    cy.clickButtonByName('Add Facilitators')

    cy.getPopup().within(($popup) => {
      cy.wrap($popup).checkPopupHeader('Add Facilitators')
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          LmsAdminIntercept._itcSearchUsersManagePeople.set()
          cy.inputByPlaceholder('Search users by name', name)
          LmsAdminIntercept._itcSearchUsersManagePeople.wait()
          cy.wait(1000)
          cy.getCheckbox().first().check()
        })
      LmsAdminIntercept._itcAddManageMember.set()
      cy.wrap($popup)
        .getPopupFooter()
        .within(() => {
          cy.clickButtonByName('Add')
        })
      LmsAdminIntercept._itcAddManageMember.wait()
    })
  }
  removeFacilitator(email) {
    cy.get('.manage-people table').then(($table) => {
      if ($table.find(`td:contains(${email})`).length) {
        cy.getElementWithLabel(email, 'td')
          .first()
          .parents('tr')
          .within(($tr) => {
            cy.wrap($tr).clickDropdownItem(Field.REMOVE).as('item')
          })
        LmsAdminIntercept._itcRemoveMemberRole.set()
        cy.get('@item').swal2().swal2Confirm(Field.YES_REMOVE).click()
        LmsAdminIntercept._itcRemoveMemberRole.wait()
        cy.waitLoadingOverlayNotExist()
      }
    })
  }
  expectFacilitatorAddedToList(email) {
    cy.get('.manage-people table')
      .first()
      .within(() => {
        cy.getElementWithLabel(email, 'td').should('be.visible')
      })
  }
  expectFacilitatorSubscribedToCategory(name) {
    InterceptDiscussion.FetchSubscribedCategories.set()
    this.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
    InterceptDiscussion.FetchSubscribedCategories.wait()
    this.expectCategoryIsSubscribed(name, 'a')
  }
  unsubscribedCategoryIfSubscribed(name, elem = 'a') {
    InterceptDiscussion.FetchSubscribedCategories.set()
    this.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
    InterceptDiscussion.FetchSubscribedCategories.wait()
    cy.wait(2000)

    cy.get('.category-section').within(($section) => {
      if ($section.find(`a.subject:contains(${name})`).length) {
        this.getItemBySubject(name, elem).within(($category) => {
          cy.wrap($category).clickDropdownItem(Discussion.UNSUBSCRIBE)
        })
      }
    })
  }
}

export default ManageDiscussion
