import Notification from '../../../../classes/discussion/base-discussion/Notification'
import ThreadDetails from '../../../../classes/discussion/base-discussion/ThreadDetail'
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
  const threadDetails = new ThreadDetails()
  const signInAsLms = new SignInLmsAs()
  const notification = new Notification()

  context(Story.discussion, () => {
    let course
    let instanceId
    let username
    let onlyRequiredFieldUncategorisedThread
    let onlyRequiredFieldUncategorisedThreadSubject

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        discussionDetail.setCourse(course)
      })
      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ NewThreads }) => {
          onlyRequiredFieldUncategorisedThread = NewThreads.onlyRequiredFieldUncategorised
          onlyRequiredFieldUncategorisedThreadSubject = onlyRequiredFieldUncategorisedThread.subject
          discussionDetail.setThreadSubject(onlyRequiredFieldUncategorisedThreadSubject)
        })
      new YamlHelper('users-orgmgt')
        .read()
        .its('Users.uat.auLnIstMem_Delphia')
        .then((user) => {
          username = user.fullName
        })
    })

    it('Instance Member create new thread under uncategorised then facilitator receive notification', () => {
      Story.ticket('QA-1777')

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Remove thread if exist', () => {
        discussionDetail.removeThreadIfExist(onlyRequiredFieldUncategorisedThreadSubject)
      })

      context('Create new thread', () => {
        discussionDetail.clickNewThreadButton()
        discussionDetail.fillInSubject(onlyRequiredFieldUncategorisedThreadSubject)
        discussionDetail.clickPublishButton()
        threadDetails.verifyThreadDetails(onlyRequiredFieldUncategorisedThread)
      })

      context('Verify facilitator receive web notification', () => {
        signInAsLms.istFaci_Britney()
        webNotification.clickOnWebNotificationIcon()
        notification.verifyUserCreateNewThreadWebNotification(
          username,
          course.name,
          onlyRequiredFieldUncategorisedThreadSubject
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
