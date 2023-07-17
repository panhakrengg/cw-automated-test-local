import Field from '../../constants/Field'

class DiscussionQueries {
  getCoPDiscussionUrl(copUrl) {
    return `${copUrl}/collaboration/discussion`
  }

  getThreadDetail() {
    return cy.get('.forum-detail')
  }

  getCategoryDetail() {
    return cy.get('.category-detail')
  }

  getSubjectText() {
    return cy.get('.subject')
  }

  getTotalThread(subject) {
    cy.wait(1000)
    cy.cardBody().within(($thread) => {
      cy.wrap($thread.find(`.subject:contains("${subject}")`).length).as('totalThread')
    })
    return cy.get('@totalThread')
  }

  getTotalCategory(name) {
    cy.wait(1000)
    cy.get('.category-section').within(($categoryList) => {
      cy.wrap($categoryList.find(`.subject:contains("${name}")`).length).as('totalCategory')
    })
    return cy.get('@totalCategory')
  }

  getThreadWrapperBy(subject) {
    return cy.getElementWithLabel(subject, 'a.subject').parents('.thread-wrapper').first()
  }

  getIconBlockInThreadDetail() {
    return cy.get('.forum-detail .align-items-center.mt-4 a')
  }

  getThreadWrapperOnReplyBy(reply) {
    return cy.getElementWithLabel(reply, '.thread-wrapper')
  }

  getTotalReply(reply) {
    this.getThreadDetail().within(($comment) => {
      cy.wrap($comment.find(`.description:contains("${reply}")`).length).as('totalReply')
    })
    return cy.get('@totalReply')
  }

  getIconBlockInReplySection(reply) {
    return this.getThreadWrapperOnReplyBy(reply).find('.align-items-center.mt-4 a')
  }

  getIconDownVoteReply(reply) {
    return this.getIconBlockInReplySection(reply).eq(1)
  }

  getIconUpVoteReply(reply) {
    return this.getIconBlockInReplySection(reply).eq(0)
  }

  getIconDownVoteThread() {
    return this.getIconBlockInThreadDetail().eq(1)
  }

  getIconUpVoteThread() {
    return this.getIconBlockInThreadDetail().eq(0)
  }

  getButtonReplyInThread() {
    return cy.getButtonByName(Field.REPLY).eq(0)
  }

  getButtonReplyInRepliesSection() {
    return cy.get(`.thread-comment button:contains("${Field.REPLY}")`)
  }

  getCommentBox() {
    return cy.get('#commentBox')
  }
}
export default DiscussionQueries
