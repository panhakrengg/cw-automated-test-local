import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, threadSubject
  let memberReply, adminReply
  let copMember, copAdmin

  const replyThread = (replyValue) => {
    cy.logInTestCase('Reset: remove reply')
    copDiscussion.actionDiscussion.clickThread(threadSubject)
    copDiscussion.actionDiscussion.removeReplies(replyValue)

    cy.logInTestCase('Reply')
    copDiscussion.actionDiscussion.clickButtonReplyInThread()
    copDiscussion.actionDiscussion.fillThenClickReply(replyValue)
    copDiscussion.assertionDiscussion.expectReplyThreadSuccessfully(replyValue)
  }

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getReplyThreadOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        const thread = cop.discussions.threads.multiReplies
        threadSubject = thread.subject
        memberReply = thread.replies.byMember.new
        adminReply = thread.replies.byAdmin.new
      })

      cy.stubUser(UserRole.CoPAdministrationUser.MEMBER_ENOLA).then((user) => {
        copMember = user.fullName
      })

      cy.stubUser(UserRole.CoPAdministrationUser.ADMIN_KENDAL).then((user) => {
        copAdmin = user.fullName
      })
    })

    it('CoP Member and CoP Admin reply in one thread then author receive notification - OCoP', () => {
      Story.ticket('QA-1224')

      cy.logInTestCase('CoP Member reply thread')
      copDiscussion.login.copMemberEnola(communityUrl)
      replyThread(memberReply)

      cy.logInTestCase('CoP Admin reply thread')
      copDiscussion.login.copAdminKendal(communityUrl)
      replyThread(adminReply)

      cy.logInTestCase('Thread author as cop owner')
      SignInAs.copOwner_Kristy()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.assertionThreadNotification.expectToSee2PeopleReplyToThreadNotification(
        copAdmin,
        copMember,
        communityName,
        threadSubject
      )

      cy.logInTestCase('Click web notification')
      copDiscussion.actionThreadNotification.clickDiscussionNotification(threadSubject)
      copDiscussion.assertionDiscussion.expectReplyThreadSuccessfully(memberReply)

      cy.logInTestCase('Reset: remove notification')
      copDiscussion.actionNotification.clickThenRemoveNotificationByBadgeDesc(threadSubject)
    })
  })
})
