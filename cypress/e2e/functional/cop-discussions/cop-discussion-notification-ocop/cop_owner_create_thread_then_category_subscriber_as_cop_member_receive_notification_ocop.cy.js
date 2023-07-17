import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPDiscussions, { retries: 1 }, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, thread, subject, subjectTruncated, userName

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getNewThreadsOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        thread = cop.discussions.threads.auKristySubscriberReceiveNotification
        subject = thread.subject
        subjectTruncated = thread.subjectTruncated
      })

      cy.stubUser(UserRole.CoPAdministrationUser.OWNER_KRISTY).then((user) => {
        userName = user.fullName
      })
    })

    it('CoP Owner create thread then category subscriber as cop-member receive notification - OCoP', () => {
      Story.ticket('QA-1225')
      copDiscussion.login.copOwnerKristy(communityUrl)

      cy.logInTestCase('Reset: remove thread')
      copDiscussion.actionDiscussion.removeThreads(subject)

      cy.logInTestCase('Create then publish new thread')
      copDiscussion.actionDiscussion.createThenPublishNewThread(thread)
      copDiscussion.assertionDiscussion.expectToOpenThreadDetail(subject)

      cy.logInTestCase('Category subscriber as cop-member receive notification')
      SignInAs.copMember_Enola()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.assertionThreadNotification.expectToSeeCoPPostedNewThreadNotification(
        userName,
        communityName,
        subjectTruncated
      )

      cy.logInTestCase('Click web notification')
      copDiscussion.actionThreadNotification.clickDiscussionNotification(subjectTruncated)
      copDiscussion.assertionDiscussion.expectToOpenThreadDetail(subject)

      cy.logInTestCase('Reset: remove notification')
      copDiscussion.actionNotification.clickThenRemoveNotificationByBadgeDesc(subjectTruncated)
    })
  })
})
