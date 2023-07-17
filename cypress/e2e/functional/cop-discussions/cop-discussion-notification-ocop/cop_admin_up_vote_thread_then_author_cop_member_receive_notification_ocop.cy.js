import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPDiscussions, { retries: 1 }, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, subject, totalReact

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getCommunitiesOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        const thread = cop.discussions.threads.voteThread
        subject = thread.subject
        totalReact = thread.totalReact
      })
    })

    it('CoP Admin up vote thread then author as cop-member receives notification - OCoP', () => {
      Story.ticket('QA-1315')
      copDiscussion.login.copAdminKendal(communityUrl)

      cy.logInTestCase('Reset: does not vote the thread')
      copDiscussion.actionDiscussion.clickThread(subject)
      copDiscussion.actionDiscussion.resetUpVoteThread()

      cy.logInTestCase('Create then publish new thread')
      copDiscussion.actionDiscussion.clickIconUpvoteThread()
      copDiscussion.assertionDiscussion.expectUpVoteThreadSuccessfully()

      cy.logInTestCase('Author as cop-member ')
      SignInAs.copMember_Enola()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.assertionThreadNotification.expectToSee1PersonReactThreadNotification(
        totalReact,
        communityName,
        subject
      )

      cy.logInTestCase('Click web notification')
      copDiscussion.actionThreadNotification.clickDiscussionNotification(subject)
      copDiscussion.assertionDiscussion.expectUpVoteThreadSuccessfully()

      cy.logInTestCase('Reset: remove notification')
      copDiscussion.actionNotification.clickThenRemoveNotificationByBadgeDesc(subject)
    })
  })
})
