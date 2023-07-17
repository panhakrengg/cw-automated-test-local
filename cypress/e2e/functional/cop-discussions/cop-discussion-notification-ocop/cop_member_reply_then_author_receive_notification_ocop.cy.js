import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, threadSubject, replyValue, author

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getReplyThreadOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        const thread = cop.discussions.threads.singleReply
        threadSubject = thread.subject
        replyValue = thread.replies.byMember.new
      })

      cy.stubUser(UserRole.CoPAdministrationUser.MEMBER_ENOLA).then((user) => {
        author = user.fullName
      })
    })

    it('CoP Member reply then author receive notification - OCoP', () => {
      Story.ticket('QA-1226')
      copDiscussion.login.copMemberEnola(communityUrl)

      cy.logInTestCase('Reset: remove reply')
      copDiscussion.actionDiscussion.clickThread(threadSubject)
      copDiscussion.actionDiscussion.removeReplies(replyValue)

      cy.logInTestCase('Reply')
      copDiscussion.actionDiscussion.clickButtonReplyInThread()
      copDiscussion.actionDiscussion.fillThenClickReply(replyValue)
      copDiscussion.assertionDiscussion.expectReplyThreadSuccessfully(replyValue)

      cy.logInTestCase('Thread author as cop admin')
      SignInAs.copAdmin_Kendal()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.assertionThreadNotification.expectToSee1PersonReplyToThreadNotification(
        author,
        communityName,
        threadSubject
      )

      cy.logInTestCase('Click web notification')
      copDiscussion.actionThreadNotification.clickDiscussionNotification(threadSubject)
      copDiscussion.assertionDiscussion.expectReplyThreadSuccessfully(replyValue)

      cy.logInTestCase('Reset: remove notification')
      copDiscussion.actionNotification.clickThenRemoveNotificationByBadgeDesc(threadSubject)
    })
  })
})
