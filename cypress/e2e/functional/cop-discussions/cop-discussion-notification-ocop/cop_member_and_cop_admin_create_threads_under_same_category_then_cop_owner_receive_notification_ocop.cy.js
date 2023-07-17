import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl
  let memberThread, memberSubject
  let adminThread, adminSubject
  let copMember, copAdmin

  const createThread = (thread) => {
    cy.logInTestCase('Reset: remove thread')
    copDiscussion.actionDiscussion.removeThreads(thread.subject)

    cy.logInTestCase('Create then publish new thread')
    copDiscussion.actionDiscussion.createThenPublishNewThread(thread)
    copDiscussion.assertionDiscussion.expectToOpenThreadDetail(thread.subject)
  }

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getNewThreadsOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        const thread = cop.discussions.threads
        adminThread = thread.auKendallThreadSameCategory
        adminSubject = adminThread.subject
        memberThread = thread.auEnolaThreadSameCategory
        memberSubject = memberThread.subject
      })

      cy.stubUser(UserRole.CoPAdministrationUser.MEMBER_ENOLA).then((user) => {
        copMember = user.fullName
      })

      cy.stubUser(UserRole.CoPAdministrationUser.ADMIN_KENDAL).then((user) => {
        copAdmin = user.fullName
      })
    })

    it('CoP Member and CoP Admin create threads under the same category then CoP Owner receive notification - OCoP', () => {
      Story.ticket('QA-1316')

      cy.logInTestCase('CoP Member')
      copDiscussion.login.copMemberEnola(communityUrl)
      createThread(memberThread)

      cy.logInTestCase('CoP Admin')
      copDiscussion.login.copAdminKendal(communityUrl)
      createThread(adminThread)

      cy.logInTestCase('CoP Owner receive 2 notifications')
      SignInAs.copOwner_Kristy()
      copDiscussion.actionNotification.clickIconNotification()
      copDiscussion.assertionThreadNotification.expectToSeeCoPPostedNewThreadNotification(
        copMember,
        communityName,
        memberSubject
      )
      copDiscussion.assertionThreadNotification.expectToSeeCoPPostedNewThreadNotification(
        copAdmin,
        communityName,
        adminSubject
      )

      cy.logInTestCase('Reset: remove 2 notifications')
      copDiscussion.actionNotification.removeNotificationByBadgeDesc(memberSubject)
      copDiscussion.actionNotification.removeNotificationByBadgeDesc(adminSubject)
    })
  })
})
