import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityUrl, thread, subject

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getNewThreadsOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityUrl = cop.url

        thread = cop.discussions.threads.auEnolaRemoveNotification
        subject = thread.subject
      })
    })

    it('CoP Admin remove discussion web notification - OCoP', () => {
      Story.ticket('QA-1320')
      cy.logInTestCase('Precondition: member create new thread')
      copDiscussion.login.copMemberEnola(communityUrl)
      copDiscussion.actionDiscussion.removeThreads(subject)
      copDiscussion.actionDiscussion.createThenPublishNewThread(thread)

      cy.logInTestCase('CoP Admin remove web notification')
      SignInAs.copAdmin_Kendal()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.queryNotification.getTotalFromNotificationIcon().then((totalInIconBefore) => {
        copDiscussion.queryNotification.getTotalFromNotificationsTab().then((totalInTabBefore) => {
          cy.logInTestCase('Remove web notification')
          copDiscussion.actionNotification.removeNotificationByBadgeDesc(subject)
          copDiscussion.assertionThreadNotification.expectNotToSeeNotification(subject)
          cy.logInTestCase('Total notification decrease 1')
          copDiscussion.queryNotification
            .getTotalFromNotificationIcon()
            .then((totalInIconAfter) => expect(totalInIconBefore).to.greaterThan(totalInIconAfter))
          copDiscussion.queryNotification
            .getTotalFromNotificationsTab()
            .then((totalInTabAfter) => expect(totalInTabBefore).to.greaterThan(totalInTabAfter))
        })
      })

      cy.logInTestCase('Go to discussion')
      copDiscussion.actionDiscussion.visitCoPDiscussion(communityUrl)
      copDiscussion.assertionDiscussion.expectToSeeThread(thread)
    })
  })
})
