import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, thread, subject, userName

  const copAdminOwnerReceiveNotification = () => {
    copDiscussion.actionNotification.clickIconNotification()
    copDiscussion.assertionThreadNotification.expectToSeeCoPPostedNewThreadNotification(
      userName,
      communityName,
      subject
    )
  }

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getNewThreadsOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        thread = cop.discussions.threads.auEnolaHopeReceiveNotification
        subject = thread.subject
      })

      cy.stubUser(UserRole.CoPAdministrationUser.MEMBER_ENOLA).then((user) => {
        userName = user.fullName
      })
    })

    it('CoP Member create new thread then cop-admin & cop-owner receive notification - OCoP', () => {
      Story.ticket('QA-1223')
      copDiscussion.login.copMemberEnola(communityUrl)

      cy.logInTestCase('Reset: remove thread')
      copDiscussion.actionDiscussion.removeThreads(subject)

      cy.logInTestCase('Create then publish new thread')
      copDiscussion.actionDiscussion.createThenPublishNewThread(thread)
      copDiscussion.assertionDiscussion.expectToOpenThreadDetail(subject)

      cy.logInTestCase('CoP Admin receive notification')
      SignInAs.copAdmin_Kendal()
      copAdminOwnerReceiveNotification()

      cy.logInTestCase('Click web notification')
      copDiscussion.actionThreadNotification.clickDiscussionNotification(subject)
      copDiscussion.assertionDiscussion.expectToOpenThreadDetail(subject)

      cy.logInTestCase('CoP Owner receive notification')
      SignInAs.copOwner_Kristy()
      copAdminOwnerReceiveNotification()

      cy.logInTestCase('Reset: remove notification')
      copDiscussion.actionNotification.removeNotificationByBadgeDesc(subject)
    })
  })
})
