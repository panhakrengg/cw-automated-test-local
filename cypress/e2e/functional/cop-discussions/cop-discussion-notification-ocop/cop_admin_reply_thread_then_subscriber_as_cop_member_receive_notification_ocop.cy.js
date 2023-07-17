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

        const thread = cop.discussions.threads.memberSubscribedThread
        threadSubject = thread.subject
        replyValue = thread.replies.byAdmin.new
      })

      cy.stubUser(UserRole.CoPAdministrationUser.ADMIN_KENDAL).then((user) => {
        author = user.fullName
      })
    })

    it('CoP Admin reply thread then subscriber as cop-member receive a notification - OCoP', () => {
      Story.ticket('QA-1318')
      copDiscussion.login.copAdminKendal(communityUrl)

      cy.logInTestCase('Reset: remove reply')
      copDiscussion.actionDiscussion.clickThread(threadSubject)
      copDiscussion.actionDiscussion.removeReplies(replyValue)

      cy.logInTestCase('Reply')
      copDiscussion.actionDiscussion.clickButtonReplyInThread()
      copDiscussion.actionDiscussion.fillThenClickReply(replyValue)
      copDiscussion.assertionDiscussion.expectReplyThreadSuccessfully(replyValue)

      cy.logInTestCase('Subscriber as cop member')
      SignInAs.copMember_Enola()
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
