import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import SignInAsCoP from '../../cop/cop-administration/base-administration/SignInAsCoP'

class SetupDiscussion {
  itc = new InterceptDiscussion()

  constructor() {
    this.login = new LoginToCoPDiscussion()
  }

  getCoPDiscussionUrl(url) {
    return `${url}/collaboration/discussion`
  }

  setCategoryDiscussionObj(obj) {
    this.categoryObj = obj
  }

  setThreadDiscussionObj(obj) {
    this.threadObj = obj
  }

  clickAllCategories() {
    cy.clickLinkByName('All Categories')
    this.itc.fetchRecentThreads.wait()
  }
  clickNewThread() {
    this.itc.findExcludeCategories.set()
    cy.clickLinkByName('New Thread')
    this.itc.findExcludeCategories.wait()
  }
  clickNewCategory() {
    this.itc.findExcludeCategories.set()
    cy.clickLinkByName('New Category')
    this.itc.findExcludeCategories.wait()
  }
  fillCategory() {
    cy.inputByPlaceholder('Enter category name', this.categoryObj.name)
    if (this.categoryObj.description)
      cy.inputTextAreaFormGroup(Field.DESCRIPTION, this.categoryObj.description)
    if (this.categoryObj.parentCategory) {
      cy.getElementWithLabel('Select Parent Category', 'label')
        .parent()
        .find('.vue-treeselect__control-arrow-container')
        .click()
      cy.getElementWithLabel(
        this.categoryObj.parentCategory.name,
        '.vue-treeselect__label-container'
      )
        .first()
        .click()
    }
  }
  fillThread() {
    cy.inputByPlaceholder('Ask question or state your topic', this.threadObj.subject)
    if (this.threadObj.description) cy.typeInEditor(this.threadObj.description)
    if (this.threadObj.category) {
      cy.getElementWithLabel('Select Category', 'label')
        .parent()
        .find('.vue-treeselect__control-arrow-container')
        .click()
      cy.getElementWithLabel(
        this.threadObj.category.name,
        '.vue-treeselect__label-container'
      ).click()
    }
  }
  clickPublishThread() {
    this.itc.fetchComments.set()
    this.itc.fetchThreadDetail.set()
    cy.clickButtonByName('Publish')
    this.itc.fetchThreadDetail.wait()
    this.itc.fetchComments.wait()
  }
  clickPublishCategory() {
    cy.clickButtonByName('Publish')
    this.itc.fetchRecentThreads.wait()
  }
  createThreadDiscussion(threadObj) {
    this.setThreadDiscussionObj(threadObj)
    this.clickNewThread()
    this.fillThread()
    this.clickPublishThread()
  }

  clickReplyOnThreadBody() {
    this.itc.fetchEditorConfigComment.set()
    cy.get('.thread-wrapper').within(() => {
      cy.clickButtonByName(Field.REPLY)
    })
    this.itc.fetchEditorConfigComment.wait()
  }

  clickReplyUnderRepliesSection() {
    cy.get('.comment-action').within(() => {
      cy.clickButtonByName(Field.REPLY)
    })
    this.itc.fetchComments.wait()
  }

  clickThread() {
    cy.clickLinkByName(this.threadObj.subject)
    this.itc.fetchComments.wait()
  }

  clickThreadThenReply(replyByObj) {
    this.clickThread()
    this.replyThread(this.threadObj.replies[replyByObj].value)
  }

  replyThread(reply) {
    this.clickReplyOnThreadBody()
    cy.typeInEditor(reply)
    this.clickReplyUnderRepliesSection()
  }

  createCategoryDiscussion(categoryObj) {
    this.setCategoryDiscussionObj(categoryObj)
    this.clickAllCategories()
    this.clickNewCategory()
    this.fillCategory()
    this.clickPublishCategory()
  }

  createAnotherCategoryDiscussion(categoryObj) {
    this.setCategoryDiscussionObj(categoryObj)
    this.clickNewCategory()
    this.fillCategory()
    this.clickPublishCategory()
  }

  subscribeThread(threadObj) {
    this.setThreadDiscussionObj(threadObj)
    this.itc.threadSubscribe.set()
    cy.getElementWithLabel(this.threadObj.subject, '.subject')
      .parents('.list-group-item')
      .within((thread) => {
        cy.wrap(thread).clickDropdownItem('Subscribe')
      })
    this.itc.threadSubscribe.wait()
  }

  unSubscribeThread(threadObj) {
    this.setThreadDiscussionObj(threadObj)
    this.itc.threadSubscribe.set()
    cy.getElementWithLabel(this.threadObj.subject, '.subject')
      .parents('.list-group-item')
      .within((thread) => {
        cy.wrap(thread).clickDropdownItem('Unsubscribe')
      })
    this.itc.threadSubscribe.wait()
  }

  subscribeCategory(categoryObj) {
    this.setCategoryDiscussionObj(categoryObj)
    this.itc.subscribeCategory.set()
    this.clickAllCategories()
    cy.getElementWithLabel(this.categoryObj.name, '.subject')
      .parents('.list-group-item')
      .within((category) => {
        cy.wrap(category).clickDropdownItem('Subscribe')
      })
    this.itc.subscribeCategory.wait()
  }

  unsubscribeCategory(categoryObj) {
    this.setCategoryDiscussionObj(categoryObj)
    this.itc.subscribeCategory.set()
    cy.getElementWithLabel(this.categoryObj.name, '.subject')
      .parents('.list-group-item')
      .within((category) => {
        cy.wrap(category).clickDropdownItem('Unsubscribe')
      })
    this.itc.subscribeCategory.wait()
  }
}

class InterceptDiscussion {
  fetchRecentThreads = new InterceptReq('/forum/thread/fetch_recent_threads', 'FetchRecentThreads')
  findExcludeCategories = new InterceptReq(
    '/forum/categories/find_exclude',
    'FindExcludeCategories'
  )
  subscribeCategory = new InterceptReq('/forum/subscribe/subscribe_category', 'SubscribeCategory')
  threadSubscribe = new InterceptReq('/forum/subscribe/thread', 'ThreadSubscribe')
  fetchThreadDetail = new InterceptReq('/forum/thread/fetch_thread_detail', 'FetchThreadDetail')
  fetchComments = new InterceptReq('/forum/thread/fetch_comments', 'FetchComments')
  fetchEditorConfigComment = new InterceptReq(
    '/forum/comment/editor_config/fetch',
    'FetchEditorConfigComment'
  )

  setItcFetchRecentThreads() {
    this.fetchRecentThreads.set()
  }
  waitItcFetchRecentThreads() {
    this.fetchRecentThreads.wait()
  }
}

class LoginToCoPDiscussion {
  signInCoPAs = new SignInAsCoP()
  itc = new InterceptDiscussion()

  getCoPDiscussionUrl(copUrl) {
    return `${copUrl}/collaboration/discussion`
  }

  toCoPDiscussionAsCoPOwner_Kristy(copUrl) {
    this.itc.setItcFetchRecentThreads()
    this.signInCoPAs.owner_Kristy(this.getCoPDiscussionUrl(copUrl))
    this.itc.waitItcFetchRecentThreads()
  }

  toCoPDiscussionAsCoPAdmin_Kendal(copUrl) {
    this.itc.setItcFetchRecentThreads()
    this.signInCoPAs.admin_Kendal(this.getCoPDiscussionUrl(copUrl))
    this.itc.waitItcFetchRecentThreads()
  }

  toCoPDiscussionAsCoPMember_Enola(copUrl) {
    this.itc.setItcFetchRecentThreads()
    this.signInCoPAs.member_Enola(this.getCoPDiscussionUrl(copUrl))
    this.itc.waitItcFetchRecentThreads()
  }
}
export default SetupDiscussion
