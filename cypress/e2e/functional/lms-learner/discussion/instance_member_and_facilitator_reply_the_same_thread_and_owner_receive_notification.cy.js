import Discussion from '../../../../classes/constants/Discussion'
import InterceptDiscussion from '../../../../classes/discussion/base-discussion/InterceptDiscussion'
import Notification from '../../../../classes/discussion/base-discussion/Notification'
import ThreadDetails from '../../../../classes/discussion/base-discussion/ThreadDetail'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const threadDetails = new ThreadDetails()
  const webNotification = new WebNotification()
  const manageCourses = new ManageCourses()
  const notification = new Notification()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, { retries: 1 }, () => {
    let course
    let courseId
    let instanceId
    let replyThread
    let replyThreadSubject
    let learner
    let facilitator
    let learnerCmt
    let facilitatorCmt

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course)
        courseId = faker.getUrlId()
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        courseDiscussion.setCourse(course)
      })
      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ ReplyThread }) => {
          replyThread = ReplyThread.ownerCheckNotification
          replyThreadSubject = replyThread.subject
          learnerCmt = replyThread.replies.byLearner.new
          facilitatorCmt = replyThread.replies.byAdmin.new
          discussionDetail.setThreadSubject(replyThreadSubject)
        })
      new YamlHelper('users-orgmgt').read().then(({ Users }) => {
        facilitator = Users.uat.auLnIstLeadFaci_Amina
        learner = Users.uat.auLnIstMem_Delphia
      })
    })

    it("Instance Member and Facilitator reply in the same thread and thread's owner check notification", () => {
      Story.ticket('QA-1770')

      context('Prepare data', () => {
        signInAsLms.istLeadFaci_Amina()
        manageCourses.accessCourseInstanceBy(courseId, instanceId, Discussion.DISCUSSIONS)
        discussionDetail.clickThreadWithTitle()
        discussionDetail.removeCommentIfExist(learnerCmt)
        cy.wait(3000)
        discussionDetail.removeCommentIfExist(facilitatorCmt)
      })

      context('Learner reply thread', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        discussionDetail.unSubscribeIfSubscribed()
        discussionDetail.clickThreadWithTitle()
        discussionDetail.replyAndVerifyThreadComment(
          learnerCmt,
          learner.fullName,
          replyThreadSubject
        )
      })

      context('Admin reply thread', () => {
        InterceptDiscussion.itcFetchComment.set()
        signInAsLms.istLeadFaci_Amina()
        manageCourses.accessCourseInstanceBy(courseId, instanceId, Discussion.DISCUSSIONS)
        discussionDetail.unSubscribeIfSubscribed()
        discussionDetail.clickThreadWithTitle()
        InterceptDiscussion.itcFetchComment.wait()
        discussionDetail.replyAndVerifyThreadComment(
          facilitatorCmt,
          facilitator.fullName,
          replyThreadSubject
        )
      })

      context('Verify owner receives notifications', () => {
        signInAsLms.istMember_Mallory()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        webNotification.clickOnWebNotificationIcon()
        notification.verifyRepliedThreadNotificationByMultiPeople(
          facilitator.fullName,
          learner.fullName,
          course.name,
          replyThreadSubject
        )
        webNotification.clickOnNotificationItem()
        threadDetails.verifyCommentIsExistInThread(learnerCmt, learner.fullName)
        threadDetails.verifyCommentIsExistInThread(facilitatorCmt, facilitator.fullName)
      })

      context('Reset data', () => {
        signInAsLms.istLeadFaci_Amina()
        manageCourses.accessCourseInstanceBy(courseId, instanceId, Discussion.DISCUSSIONS)
        discussionDetail.clickThreadWithTitle()
        discussionDetail.removeCommentIfExist(learnerCmt)
        cy.wait(3000)
        discussionDetail.removeCommentIfExist(facilitatorCmt)
      })
    })
  })
})
