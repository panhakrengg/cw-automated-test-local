import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, threadSubject, replyValue, totalReact

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getCommunitiesOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        const thread = cop.discussions.threads.voteReply
        threadSubject = thread.subject

        const reply = thread.replies.byMember
        replyValue = reply.value
        totalReact = reply.totalReact
      })
    })

    it("CoP Admin down vote reply then reply's author as cop-member will receive notification - OCoP", () => {
      Story.ticket('QA-1319')
      copDiscussion.login.copAdminKendal(communityUrl)

      cy.logInTestCase('Reset: does not vote the thread')
      copDiscussion.actionDiscussion.clickThread(threadSubject)
      copDiscussion.actionDiscussion.resetDownVoteReply(replyValue)

      cy.logInTestCase('Create then publish new thread')
      copDiscussion.actionDiscussion.clickIconDownvoteReply(replyValue)
      copDiscussion.assertionDiscussion.expectDownVoteReplySuccessfully(replyValue)

      cy.logInTestCase("Reply's Author as cop-member")
      SignInAs.copMember_Enola()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.assertionThreadNotification.expectToSeeReactCommentNotification(
        totalReact,
        communityName,
        threadSubject
      )

      cy.logInTestCase('Click web notification')
      copDiscussion.actionThreadNotification.clickDiscussionNotification(threadSubject)
      copDiscussion.assertionDiscussion.expectDownVoteReplySuccessfully(replyValue)

      cy.logInTestCase('Reset: remove notification')
      copDiscussion.actionNotification.clickThenRemoveNotificationByBadgeDesc(threadSubject)
    })
  })
})
