import Field from '../../constants/Field'
import { DiscussionLabel } from '../constant/DiscussionConstant'
import DiscussionIntercepts from '../intercepts/DiscussionIntercepts'
import DiscussionQueries from '../queries/DiscussionQueries'

class DiscussionActions extends DiscussionQueries {
  #clickButtonNewThread() {
    DiscussionIntercepts.findExcludeCategories.set()
    cy.clickLinkByName(DiscussionLabel.NEW_THREAD)
    DiscussionIntercepts.findExcludeCategories.wait()
  }
  #clickButtonNewCategory() {
    DiscussionIntercepts.findExcludeCategories.set()
    cy.clickLinkByName(DiscussionLabel.NEW_CATEGORY)
    DiscussionIntercepts.findExcludeCategories.wait()
  }

  #fillSubject(subject) {
    cy.inputFormGroup(DiscussionLabel.SUBJECT, subject)
  }

  #fillDescription(description) {
    cy.clearTextEditor()
    cy.typeInEditor(description)
  }
  #selectCategory(categoryName) {
    cy.get('.create-thread').within(($createThread) => {
      cy.wrap($createThread).clickVueTreeSelect()
      cy.wrap($createThread).clickVueTreeSelectOption(categoryName)
    })
  }

  #fillThread(thread) {
    const { subject, description, category } = thread

    this.#fillSubject(subject)
    if (description) this.#fillDescription(description)
    if (category) this.#selectCategory(category.name)
  }

  #fillCategoryName(name) {
    cy.inputFormGroup(DiscussionLabel.CATEGORY_NAME, name)
  }

  #fillCategory(category) {
    const { name } = category

    this.#fillCategoryName(name)
  }

  #waitUntilButtonPublishingGone() {
    cy.expectElementWithLabelVisible(Field.PUBLISHING)
    cy.expectElementWithLabelNotExist(Field.PUBLISHING, 'button', 40000)
  }

  #waitUntilButtonPublishGone() {
    cy.expectElementWithLabelNotExist(Field.PUBLISH, 'button', 20000)
  }

  #clickButtonPublishThread() {
    DiscussionIntercepts.fetchThreadDetail.set()
    cy.clickButtonByName(Field.PUBLISH)
    this.#waitUntilButtonPublishingGone()
    DiscussionIntercepts.fetchThreadDetail.wait()
  }

  #clickButtonPublishCategory() {
    DiscussionIntercepts.fetchCategoryForum.set()
    cy.clickButtonByName(Field.PUBLISH)
    this.#waitUntilButtonPublishGone()
    DiscussionIntercepts.fetchRecentThreads.wait()
    DiscussionIntercepts.fetchCategoryForum.wait()
  }

  #clickButtonYesRemoveThread() {
    DiscussionIntercepts.removeThread.set()
    cy.clickButtonByName(Field.YES_REMOVE)
    DiscussionIntercepts.removeThread.wait()
  }

  #clickButtonYesRemoveCategory() {
    DiscussionIntercepts.removeCategoryForum.set()
    cy.clickButtonByName(Field.YES_REMOVE)
    DiscussionIntercepts.removeCategoryForum.wait()
  }

  #clickButtonYesRemoveReply() {
    DiscussionIntercepts.modifyComment.set()
    DiscussionIntercepts.fetchThreadDetail.set()
    cy.clickButtonByName(Field.YES_REMOVE)
    DiscussionIntercepts.modifyComment.wait()
    DiscussionIntercepts.fetchThreadDetail.wait()
    cy.waitLoadingOverlayNotExist()
  }

  visitCoPDiscussion(copUrl) {
    DiscussionIntercepts.fetchRecentThreads.set()
    cy.visit(super.getCoPDiscussionUrl(copUrl))
    DiscussionIntercepts.fetchRecentThreads.wait()
  }

  removeThreads(subject) {
    super.getTotalThread(subject).then((total) => {
      for (let index = 0; index < total; index++) {
        super.getThreadWrapperBy(subject).within(($thread) => {
          cy.wrap($thread).clickDropdownItem(Field.REMOVE)
        })
        this.#clickButtonYesRemoveThread()
      }
    })
  }

  removeCategories(name) {
    super.getTotalCategory(name).then((total) => {
      for (let index = 0; index < total; index++) {
        super.getThreadWrapperBy(name).within(($thread) => {
          cy.wrap($thread).clickDropdownItem(Field.REMOVE)
        })
        this.#clickButtonYesRemoveCategory()
      }
    })
  }

  createThenPublishNewThread(thread) {
    this.#clickButtonNewThread()
    this.#fillThread(thread)
    this.#clickButtonPublishThread()
  }

  clickAllCategories() {
    DiscussionIntercepts.findCategoriesForum.set()
    cy.clickLinkByName(DiscussionLabel.ALL_CATEGORIES)
    DiscussionIntercepts.findCategoriesForum.wait()
  }

  createThenPublishNewCategory(category) {
    this.#clickButtonNewCategory()
    this.#fillCategory(category)
    this.#clickButtonPublishCategory()
  }

  clickThread(subject) {
    DiscussionIntercepts.fetchThreadDetail.set()
    DiscussionIntercepts.fetchCommentsThread.set()
    cy.clickLinkByName(subject)
    DiscussionIntercepts.fetchThreadDetail.wait()
    DiscussionIntercepts.fetchCommentsThread.wait()
  }

  resetUpVoteThread() {
    super
      .getIconUpVoteThread()
      .invoke('attr', 'class')
      .then((attr) => {
        if (attr.includes('text-primary')) this.clickIconUpvoteThread()
      })
  }

  resetDownVoteThread() {
    super
      .getIconDownVoteThread()
      .invoke('attr', 'class')
      .then((attr) => {
        if (attr.includes('text-primary')) this.clickIconDownvoteThread()
      })
  }

  clickIconUpvoteThread() {
    DiscussionIntercepts.updateVotesThread.set()
    super.getIconUpVoteThread().click()
    DiscussionIntercepts.updateVotesThread.wait()
    cy.wait(1000)
  }

  clickIconDownvoteThread() {
    DiscussionIntercepts.updateVotesThread.set()
    super.getIconDownVoteThread().click()
    DiscussionIntercepts.updateVotesThread.wait()
    cy.wait(1000)
  }

  resetDownVoteReply(reply) {
    super
      .getIconDownVoteReply(reply)
      .invoke('attr', 'class')
      .then((attr) => {
        if (attr.includes('text-primary')) this.clickIconDownvoteReply(reply)
      })
  }

  clickIconUpvoteReply(reply) {
    DiscussionIntercepts.updateVotesThread.set()
    super.getIconUpVoteReply(reply).click()
    DiscussionIntercepts.updateVotesThread.wait()
    cy.wait(1000)
  }

  clickIconDownvoteReply(reply) {
    DiscussionIntercepts.updateVotesThread.set()
    super.getIconDownVoteReply(reply).click()
    DiscussionIntercepts.updateVotesThread.wait()
    cy.wait(1000)
  }

  removeReplies(reply) {
    DiscussionIntercepts.fetchEditorConfigComment.set()
    super.getTotalReply(reply).then((total) => {
      for (let index = 0; index < total; index++) {
        super
          .getThreadWrapperOnReplyBy(reply)
          .first()
          .within(($reply) => {
            cy.wrap($reply).clickDropdownItem(Field.REMOVE)
          })
        this.#clickButtonYesRemoveReply()
      }
    })
  }

  clickButtonReplyInThread() {
    cy.wait(1000)
    super.getButtonReplyInThread().click()
    cy.wait(2000) // wait text editor appear
  }

  #clickButtonReplyInReplies() {
    DiscussionIntercepts.fetchCommentsThread.set()
    super.getButtonReplyInRepliesSection().click()
    DiscussionIntercepts.fetchCommentsThread.wait()
  }

  #fillReply(reply) {
    super.getCommentBox().within(() => cy.typeInEditor(reply))
  }

  fillThenClickReply(reply) {
    this.#fillReply(reply)
    this.#clickButtonReplyInReplies()
  }
}
export default DiscussionActions
