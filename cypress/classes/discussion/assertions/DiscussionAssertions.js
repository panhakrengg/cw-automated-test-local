import DiscussionQueries from '../queries/DiscussionQueries'

class DiscussionAssertions extends DiscussionQueries {
  expectToOpenThreadDetail(subject) {
    super.getThreadDetail().within(() => {
      super.getSubjectText().should('have.text', subject)
    })
  }
  expectToOpenCategoryDetail(name) {
    super.getCategoryDetail().within(() => {
      super.getSubjectText().should('have.text', name)
    })
  }

  expectToSeeThread(thread) {
    const { subject } = thread

    super.getThreadWrapperBy(subject).should('be.visible')
  }

  expectUpVoteThreadSuccessfully() {
    super
      .getIconUpVoteThread()
      .invoke('text')
      .then((vote) => expect(parseInt(vote)).to.eq(1))
  }

  expectDownVoteReplySuccessfully(replyValue) {
    super
      .getIconDownVoteReply(replyValue)
      .invoke('text')
      .then((vote) => expect(parseInt(vote)).to.eq(1))
  }

  expectReplyThreadSuccessfully(replyValue) {
    cy.expectElementWithLabelVisible(replyValue, '.description')
  }
}
export default DiscussionAssertions
