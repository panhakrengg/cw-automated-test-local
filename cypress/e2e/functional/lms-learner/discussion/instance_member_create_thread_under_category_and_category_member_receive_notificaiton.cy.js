import Notification from '../../../../classes/discussion/base-discussion/Notification'
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
  const notification = new Notification()

  context(Story.discussion, () => {
    let course
    let instanceId
    let newThread
    let categorySubscriber
    let instanceMember

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        courseDiscussion.setCourse(course)
      })
      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ NewThreads }) => {
          newThread = NewThreads.underCategorySubscriberCheckNotification
          discussionDetail.setThreadSubject(newThread.subject)
        })
      new YamlHelper('users-orgmgt').read().then(({ Users }) => {
        categorySubscriber = Users.uat.auLnIstMem_Mallory
        instanceMember = Users.uat.auLnIstMem_Delphia
      })
    })

    it("Instance Member create thread under category and category's subscriber(learner) will receive notification", () => {
      Story.ticket('QA-1755')

      context('Instance member create thread under category', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        discussionDetail.removeThreadIfExist(newThread.subject)
        discussionDetail.createThread(newThread)
      })

      context("Category's subscriber receives notification", () => {
        signInAsLms.istMember_Mallory()
        webNotification.clickOnWebNotificationIcon()
        notification.verifyUserCreateNewThreadWebNotification(
          instanceMember.fullName,
          course.name,
          newThread.truncateSubject
        )
      })

      context('Reset data', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        discussionDetail.removeThread()
      })
    })
  })
})
