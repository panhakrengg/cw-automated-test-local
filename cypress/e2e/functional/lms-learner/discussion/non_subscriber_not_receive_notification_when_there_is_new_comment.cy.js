import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, { retries: 1 }, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const webNotification = new WebNotification()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    let course
    let instanceId
    let replyThread
    let replyThreadSubject
    let instanceMember
    let learnerCmt

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        courseDiscussion.setCourse(course)
      })
      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ ReplyThread }) => {
          replyThread = ReplyThread.nonSubscriberCheckNotification
          replyThreadSubject = replyThread.subject
          learnerCmt = replyThread.replies.byLearner.new
          discussionDetail.setThreadSubject(replyThreadSubject)
        })
      new YamlHelper('users-orgmgt').read().then(({ Users }) => {
        instanceMember = Users.uat.auLnIstMem_Mallory
      })
    })

    it("Non-subscriber (thread's owner) not receive notification when there is new comment", () => {
      Story.ticket('QA-1765')

      context('Prepare data', () => {
        signInAsLms.istMember_Mallory()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        discussionDetail.clickThreadWithTitle()
        discussionDetail.removeCommentIfExist(learnerCmt)
      })

      context('Instance member replied thread', () => {
        discussionDetail.replyAndVerifyThreadComment(
          learnerCmt,
          instanceMember.fullName,
          replyThreadSubject
        )
      })

      context("Non-subscriber (thread's owner) checks notification", () => {
        signInAsLms.istMember_Delphia()
        webNotification.clickOnWebNotificationIcon()
        webNotification.notReceiveNotification(replyThreadSubject)
      })

      context('Reset data', () => {
        signInAsLms.istMember_Mallory()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        discussionDetail.clickThreadWithTitle()
        discussionDetail.removeCommentIfExist(learnerCmt)
      })
    })
  })
})
