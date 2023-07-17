import Discussion from '../../../../classes/constants/Discussion'
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

describe(Epic.LmsLearner, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const threadDetails = new ThreadDetails()
  const webNotification = new WebNotification()
  const notification = new Notification()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    let course
    let instanceId
    let reactLikeThread
    let reactLikeThreadSubject
    let reactDislikeThread
    let reactDislikeThreadSubject

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        courseDiscussion.setCourse(course)
      })

      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ SampleDiscussion }) => {
          reactLikeThread = SampleDiscussion.threads.learner_Delphia_like
          reactLikeThreadSubject = reactLikeThread.subject
          reactDislikeThread = SampleDiscussion.threads.learner_Delphia_dislike
          reactDislikeThreadSubject = reactDislikeThread.subject
        })
    })

    it('Instance Member reacted on threads and owner check notification', () => {
      Story.ticket('QA-1772')

      context('Entry point', () => {
        signInAsLms.istMember_Mallory()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Prepare data', () => {
        discussionDetail.setThreadSubject(reactDislikeThreadSubject)
        discussionDetail.clickThreadWithTitle()
        threadDetails.getTotalReaction(threadDetails.votes.dislike).then(($totalDislike) => {
          if ($totalDislike > 0) {
            threadDetails.clickDislike()
          }
        })
        threadDetails.clickBackIcon()
        discussionDetail.setThreadSubject(reactLikeThreadSubject)
        discussionDetail.clickThreadWithTitle()
        threadDetails.getTotalReaction(threadDetails.votes.like).then(($totalLike) => {
          if ($totalLike > 0) {
            threadDetails.clickLike()
          }
        })
      })

      threadDetails.getTotalReaction(threadDetails.votes.dislike).then(($oldTotalDislike) => {
        context('Like thread', () => {
          threadDetails.clickLike()
          threadDetails.clickBackIcon()
        })

        context('Dislike thread', () => {
          discussionDetail.setThreadSubject(reactDislikeThreadSubject)
          discussionDetail.clickThreadWithTitle()
          threadDetails.clickDislike()
          threadDetails.clickBackIcon()
        })

        context('Verify owner receive like web notification', () => {
          signInAsLms.istMember_Delphia()
          webNotification.clickOnWebNotificationIcon()
          notification.verifyUserReceiveWebNotificationForThreadReaction(
            course,
            reactLikeThreadSubject
          )
        })

        context('Verify owner receive dislike web notification', () => {
          notification.verifyUserReceiveWebNotificationForThreadReaction(
            course,
            reactDislikeThreadSubject
          )
          webNotification.clickOnNotificationItem()
        })

        context('Verify owner see dislike increase', () => {
          threadDetails.verifyDislikeIsIncrease($oldTotalDislike)
        })

        context('Reset data', () => {
          webNotification.clickOnWebNotificationIcon()
          webNotification.getNotificationBy(reactDislikeThreadSubject)
          webNotification.deleteTheLastNotificationItem()
          webNotification.getNotificationBy(reactLikeThreadSubject)
          webNotification.deleteTheLastNotificationItem()
        })
      })
    })
  })
})
