import Discussion from '../../constants/Discussion'
import Field from '../../constants/Field'
import Converter from '../../utilities/Converter'
import InterceptDiscussion from './InterceptDiscussion'
import ThreadDetails from './ThreadDetail'

class BaseDiscussion {
  _leftSidebarItems = [
    Discussion.RECENT,
    Discussion.MY_THREADS,
    Discussion.MY_SUBSCRIPTIONS,
    Discussion.ALL_CATEGORIES,
  ]
  _recentCardHeader = [Discussion.ALL_THREADS]
  _myThreadCardHeader = [Discussion.MY_THREADS]
  _mySubscriptionsCardHeader = [Discussion.SUBSCRIBED_CATEGORIES, Discussion.SUBSCRIBED_THREADS]
  _allCategoriesCardHeader = [Discussion.ALL_CATEGORIES]
  _subCategoriesCardHeader = [Discussion.BACK, Discussion.SUB_CATEGORIES, Discussion.ALL_THREADS]

  #course
  #componentType //ex: Discussions, Notes, ...
  threadSubject

  constructor(subject) {
    this.threadSubject = subject
  }

  setCourse(course) {
    this.#course = course
  }

  setComponentType(type) {
    this.#componentType = type
  }

  setThreadSubject(subject) {
    this.threadSubject = subject
  }

  /* Query */
  #getLeftSidebarWith(name) {
    //name <= 'constants/lms/discussion.js'
    return cy.getElementWithLabel(name, 'nav > a.nav-link')
  }

  #getLeftSidebarItems() {
    return cy.get('nav > a.nav-link')
  }

  #getCourseTitle() {
    return cy.getElementWithLabel(this.#course.name, '.cec-card__title')
  }

  #getCourseBackIcon() {
    return this.#getCourseTitle().siblings('a')
  }

  #getComponentTitle() {
    cy.get('.forum-wrapper').within(() => {
      cy.getElementWithLabel(this.#componentType, 'span').as('componentTitle')
    })
    return cy.get('@componentTitle')
  }

  #getComponentIcon() {
    return this.#getComponentTitle(this.#componentType).siblings('svg')
  }

  _getNewThreadButton() {
    return cy.getElementWithLabel('New Thread', 'a')
  }

  _getNewCategoryButton() {
    return cy.getElementWithLabel('New Category', 'a')
  }

  #getDiscussionSearchBox() {
    cy.get('.search-box-wrapper').within(() => {
      cy.get('input[placeholder="Search discussion..."]').as('searchBox')
    })
    return cy.get('@searchBox')
  }

  #getCardHeaders() {
    return cy.get('.card-header')
  }

  #getSelectToView() {
    return cy.getElementWithLabel('Select to view:', 'span')
  }

  #getSelectToViewDropdown() {
    return this.#getSelectToView().siblings('.cw-dropdown')
  }

  getThreadViaSubject(element = 'a') {
    return cy
      .getElementWithLabel(this.threadSubject, element)
      .first()
      .parents('.thread-wrapper')
      .parent()
  }

  getItemBySubject(subject, element = 'a') {
    return cy.getElementWithLabel(subject, element).first().parents('.thread-wrapper').parent()
  }

  #getAllListItems() {
    return cy.get('.list-group-item')
  }

  _getCategorySection() {
    return cy.get('.category-section')
  }

  #getThreadSection() {
    return cy.get('.thread-section')
  }

  #getSubjectInput() {
    return cy.get('input[name="_courseDetailPortlet_subject"]')
  }
  _getCategoryNameInput() {
    return cy.get('input[placeholder="Enter category name"]')
  }
  _getCategoryDescriptionInput() {
    return cy.get('textarea[placeholder="Enter description for your category"]')
  }
  _getThreadNameInput(subject = '_learningAdminManageCoursesPortlet_subject') {
    return cy.get(`input[name="${subject}"]`)
  }
  /* Actions */
  selectThreadThreeDotBy(itemName) {
    this.getThreadViaSubject().within(($thread) => {
      cy.wrap($thread).clickDropdownItem(itemName)
    })
  }

  clickLeftSideBarBy(name) {
    this.#getLeftSidebarWith(name).click()
  }

  clickCategoryByName(subject) {
    InterceptDiscussion.itcFetchRecentThreads.set()
    cy.getElementWithLabel(subject, 'a.subject').click()
    InterceptDiscussion.itcFetchRecentThreads.wait()
  }

  clickNewThreadButton() {
    InterceptDiscussion.itcFindExcludeCategories.set()
    this._getNewThreadButton().click()
    InterceptDiscussion.itcFindExcludeCategories.wait()
  }

  clickThreadWithTitle() {
    InterceptDiscussion.itcFetchThreadDetail.set()
    cy.getElementWithLabel(this.threadSubject, '.thread-wrapper a.subject').click()
    InterceptDiscussion.itcFetchThreadDetail.wait()
  }

  search(keywords) {
    this.#getDiscussionSearchBox().clear().type(`"${keywords}" {enter}`)
  }

  filterThreads(name) {
    cy.get('.filter-thread').within(() => {
      cy.clickCwDropdownItem(name)
    })
  }

  _getTotalViewThread() {
    this.getThreadViaSubject().within(() => {
      cy.get('i:contains("View"), i:contains("Views")')
        .siblings('span')
        .invoke('text')
        .then(($views) => {
          cy.wrap($views).as('views')
        })
    })
    return cy.get('@views')
  }

  fillInSubject(subject) {
    this.#getSubjectInput().clear().type(subject)
    cy.wait(500)
  }

  fillInDetail(detail) {
    cy.get('.cw-editor')
      .last()
      .within(() => {
        cy.clearTextEditor()
        cy.typeInEditor(detail)
      })
  }

  addTags(tags = []) {
    tags.forEach((tag) => {
      cy.inputByName('_courseDetailPortlet_tag', tag)
      this._clickAddTagButton()
    })
  }

  _clickAddTagButton() {
    cy.btnConfirm(Field.ADD).click()
  }

  #clickButton(btnName = Field.PUBLISH, btnIngName, timeout = 500) {
    InterceptDiscussion.itcFetchThreadComments.set()
    cy.get('.create-thread-wrapper .cec-card__header').within(($buttonWrapper) => {
      cy.wrap($buttonWrapper).buttonNotDisabled()
      cy.btnConfirm(btnName).click()
      cy.expectElementWithLabelVisible(btnIngName, 'button')
      cy.expectElementWithLabelNotExist(btnIngName, 'button', timeout)
    })
    InterceptDiscussion.itcFetchThreadComments.wait()
  }

  clickPublishButton(timeout = 15000) {
    this.#clickButton(Field.PUBLISH, Field.PUBLISHING, timeout)
  }

  clickUpdateButton(timeout = 15000) {
    this.#clickButton(Field.UPDATE, Field.UPDATING, timeout)
  }

  selectSpecificCategory(categoryName) {
    cy.get('.create-thread').within(($createThread) => {
      cy.wrap($createThread).clickVueTreeSelect()
      cy.wrap($createThread).clickVueTreeSelectOption(categoryName)
    })
  }

  fillingThreadData(thread) {
    this.fillInSubject(thread.subject)
    if (thread.detail) this.fillInDetail(thread.detail)
    if (thread.attachmentsPath) this.upload(thread.attachmentsPath)
    if (thread.tags) this.addTags(thread.tags)
    if (thread.category) this.selectSpecificCategory(thread.category.name)
  }

  /* Assertions */
  _verifyCourseHeader() {
    this.#getCourseTitle().should('be.visible')
    this.#getCourseBackIcon().should('be.visible')
  }

  _verifyComponentHeader() {
    this.#getComponentTitle().should('be.visible')
    this.#getComponentIcon().should('be.visible')
    this._getNewThreadButton().should('be.visible')
    this.#getDiscussionSearchBox().should('be.visible')
  }

  _verifyLeftSidebarItems() {
    this.#getLeftSidebarItems().each((item, index) => {
      cy.wrap(item).should('contain.text', this._leftSidebarItems[index])
    })
  }

  _verifyCardHeaders(cardHeaders = []) {
    this.#getCardHeaders().each((header) => {
      cy.wrap(header)
        .invoke('text')
        .then(($text) => {
          expect(cardHeaders).to.include(Converter.getContentFrom($text))
        })
    })
  }

  _verifySelectToView() {
    this.#getSelectToView().should('be.visible')
    this.#getSelectToViewDropdown().should('be.visible')
  }

  verifyThreadSubject() {
    this.getThreadViaSubject().should('be.visible')
  }

  _verifyThreadSubjects(...subjects) {
    subjects.forEach((subject) => {
      this.setThreadSubject(subject)
      this.verifyThreadSubject(subject)
    })
  }

  _verifyUnSelectableCategorySubject(subject) {
    this.setThreadSubject(subject)
    this.getThreadViaSubject('span.subject').should('be.visible')
  }

  _verifyCategorySubject(subject) {
    this.verifyThreadSubject(subject)
  }

  _verifyCategorySubjects(...subjects) {
    subjects.forEach((subject) => {
      this.setThreadSubject(subject)
      this.verifyThreadSubject(subject)
    })
  }

  verifyThreadThreeDotOptions(options = []) {
    this.getThreadViaSubject().within(($thread) => {
      cy.wrap($thread)
        .getDropdownList()
        .each((item, index) => {
          cy.wrap(item).should('contain.text', options[index]).and('be.visible')
        })
    })
  }

  _verifyCategoryButtonNotExist() {
    this._getNewCategoryButton().should('not.exist')
  }

  verifyCreatedDate(date, isNew = true) {
    this.getThreadViaSubject().within(() => {
      cy.getElementWithLabel('Created', 'i')
        .parent()
        .within(($createdDate) => {
          isNew
            ? cy.wrap($createdDate).should('contain.text', date)
            : cy.wrap($createdDate).should('not.contain.text', date)
        })
    })
  }

  verifyHasNewIndicator() {
    this.getThreadViaSubject().within(() => {
      cy.getElementWithLabel('new', '.badge').should('be.visible')
    })
  }

  _verifyPostInCategoryOfThreadItem(categoryName) {
    this.getThreadViaSubject().within(() => {
      cy.getElementWithLabel('posted in', 'i').siblings('span').should('contain.text', categoryName)
    })
  }

  verifyThreadItemCardDetail(subject, categoryName, date, isNew = true) {
    this.verifyThreadSubject(subject)
    this._verifyPostInCategoryOfThreadItem(categoryName)
    if (isNew) {
      this.verifyCreatedDate(date)
      this.verifyHasNewIndicator()
    } else {
    }
  }

  verifyThreadNotExist(subject) {
    cy.expectElementWithLabelNotExist(subject, 'a.subject')
  }

  verifyAllListItemsContainSearchKeywords(keyword) {
    this.#getAllListItems().each((item) => {
      cy.wrap(item)
        .invoke('text')
        .should((text) => {
          expect(text.toLowerCase()).to.contain(keyword.toLowerCase())
        })
    })
  }

  verifyThreadHeaderContainsCorrectTotalNumber() {
    this.#getThreadSection().within(() => {
      this.#getAllListItems().as('items')
    })
    cy.get('@items').then(($item) => {
      this.#getCardHeaders().last().should('contain.text', $item.length)
    })
  }

  verifyCategoryHeaderContainsCorrectTotalNumber() {
    this._getCategorySection().within(() => {
      this.#getAllListItems().as('items')
    })
    cy.get('@items').then(($item) => {
      this.#getCardHeaders().first().should('contain.text', $item.length)
    })
  }

  _verifyMostRecentThreadDisplayInDescending() {
    let dates = []
    this.#getAllListItems().then(($items) => {
      cy.wrap($items).each((item, index) => {
        cy.wrap(item).within(() => {
          cy.getElementWithLabel('Created', 'i')
            .parent()
            .invoke('text')
            .then(($date) => {
              const date = $date.replace('Created', '')
              dates.push(new Date(date).getTime())
              if (index == $items.length - 1) cy.wrap(dates).expectSortDescending()
            })
        })
      })
    })
  }

  verifyMostPopularThreadDisplayInDescending() {
    let totalUpvoteAndReplied = []
    this.#getAllListItems().then(($items) => {
      cy.wrap($items).each((item, index) => {
        cy.wrap(item).within(() => {
          cy.getElementWithLabel('Upvote', 'i')
            .siblings('span')
            .invoke('text')
            .then(($upvote) => {
              cy.get('i:contains("Reply"), i:contains("Replies")')
                .siblings('span')
                .invoke('text')
                .then(($reply) => {
                  const totalPopular = parseInt($reply) + parseInt($upvote)
                  totalUpvoteAndReplied.push(totalPopular)
                  if (index == $items.length - 1)
                    cy.wrap(totalUpvoteAndReplied).expectSortDescending()
                })
            })
        })
      })
    })
  }

  verifyUnAnswerThreadDisplayInAscending() {
    let allReplies = []
    this.#getAllListItems().then(($items) => {
      cy.wrap($items).each((item, index) => {
        cy.wrap(item).within(() => {
          cy.get('i:contains("Reply"), i:contains("Replies")')
            .siblings('span')
            .invoke('text')
            .then(($reply) => {
              allReplies.push($reply)
              if (index == $items.length - 1) cy.wrap(allReplies).expectSortAscending()
            })
        })
      })
    })
  }

  verifyViewThreadIncrease() {
    const threadDetail = new ThreadDetails()
    this._getTotalViewThread().then(($oldTotalViews) => {
      cy.wrap($oldTotalViews).as('oldTotalViews')
    })
    this.clickThreadWithTitle()
    threadDetail.clickBackIcon()
    cy.wait(500)
    cy.get('@oldTotalViews').then(($oldTotalViews) => {
      this._getTotalViewThread().then(($newTotalViews) => {
        expect(parseInt($newTotalViews)).to.be.greaterThan(parseInt($oldTotalViews))
      })
    })
  }
}
export default BaseDiscussion
