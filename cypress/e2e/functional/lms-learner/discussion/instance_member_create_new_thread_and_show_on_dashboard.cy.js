import InterceptDiscussion from '../../../../classes/discussion/base-discussion/InterceptDiscussion'
import RecentDiscussions from '../../../../classes/discussion/base-discussion/RecentDiscussions'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, { retries: 1 }, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const recentDiscussions = new RecentDiscussions()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()
  const manageCourse = new ManageCourses()

  context(Story.discussion, () => {
    let course
    let courseId
    let instanceId
    let threadCheckDashboard
    let threadCheckDashboardSubject

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
        .then(({ NewThreads }) => {
          threadCheckDashboard = NewThreads.threadCheckDashboard
          threadCheckDashboardSubject = threadCheckDashboard.subject
          discussionDetail.setThreadSubject(threadCheckDashboardSubject)
        })
    })

    it('Instance Member create new thread then another learner & admins check on Dashboard', () => {
      Story.ticket('QA-1883')

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Remove thread if exist', () => {
        discussionDetail.removeThreadIfExist(threadCheckDashboardSubject)
      })

      context('Create new first thread', () => {
        discussionDetail.clickNewThreadButton()
        discussionDetail.fillInSubject(threadCheckDashboardSubject)
        discussionDetail.clickPublishButton()
      })

      context('Other instance member', () => {
        InterceptDiscussion.itcFetchDiscussionUpdate.set()
        signInAsLms.istMember_Mallory()
        InterceptDiscussion.itcFetchDiscussionUpdate.wait()
        recentDiscussions.verifyThreadVisibleWith([threadCheckDashboardSubject])
      })

      context('Course facilitator', () => {
        InterceptDiscussion.itcFetchDiscussionUpdate.set()
        signInAsLms.couFaci_Joanie()
        InterceptDiscussion.itcFetchDiscussionUpdate.wait()
        recentDiscussions.verifyThreadVisibleWith([threadCheckDashboardSubject])
      })

      context('Instance facilitator', () => {
        InterceptDiscussion.itcFetchDiscussionUpdate.set()
        signInAsLms.istFaci_Britney()
        InterceptDiscussion.itcFetchDiscussionUpdate.wait()
        recentDiscussions.verifyThreadVisibleWith([threadCheckDashboardSubject])
      })

      context('Learning admin', () => {
        signInAsLms.lnAdmin_Emery()
        recentDiscussions.verifyThreadNotExistWith([threadCheckDashboardSubject])
      })

      context('Reset data', () => {
        manageCourse.accessFireCloudCourseInstanceBy(courseId, instanceId, 'Discussions')
        discussionDetail.removeThread()
      })
    })
  })
})
