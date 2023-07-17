import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, threadSubject, replyValue

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getReplyThreadOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        const thread = cop.discussions.threads.authorUnsubscribedThread
        threadSubject = thread.subject
        replyValue = thread.replies.byAdmin.new
      })
    })

    it('Thread Unsubscriber (previous author) not receive notification when there is new reply - OCoP', () => {
      Story.ticket('QA-1321')
      copDiscussion.login.copAdminBettye(communityUrl)

      cy.logInTestCase('Reset: remove reply')
      copDiscussion.actionDiscussion.clickThread(threadSubject)
      copDiscussion.actionDiscussion.removeReplies(replyValue)

      cy.logInTestCase('Reply')
      copDiscussion.actionDiscussion.clickButtonReplyInThread()
      copDiscussion.actionDiscussion.fillThenClickReply(replyValue)
      copDiscussion.assertionDiscussion.expectReplyThreadSuccessfully(replyValue)

      cy.logInTestCase('Thread Unsubscriber (previous author)')
      SignInAs.copMember_Enola()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.assertionThreadNotification.expectNotToSeeNotification(threadSubject)
    })
  })
})
