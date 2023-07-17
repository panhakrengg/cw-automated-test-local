import Discussion from '../../../../classes/constants/Discussion'
import InterceptDiscussion from '../../../../classes/discussion/base-discussion/InterceptDiscussion'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, { retries: 1 }, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    let course
    let instanceId

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        courseDiscussion.setCourse(course)
      })
    })

    it('Instance Member filter threads', () => {
      Story.ticket('QA-1763', ['CW-16444'])
      InterceptDiscussion.itcFetchTopThread.set()
      InterceptDiscussion.itcFetchUnAnsweredThread.set()

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      // context('Filter the most recent threads', () => {
      //   //TODO CW-16444: filter most recent should sort threads by modified date in descending
      //   discussionDetail._filterThreads(Discussion.MOST_RECENT)
      //   discussionDetail._verifyMostRecentThreadDisplayInDescending()
      // })

      context('Filter the most popular threads', () => {
        discussionDetail.filterThreads(Discussion.MOST_POPULAR)
        InterceptDiscussion.itcFetchTopThread.wait()
        discussionDetail.verifyMostPopularThreadDisplayInDescending()
      })

      context('Verify showing total results', () => {
        discussionDetail.filterThreads(Discussion.UNANSWERED_THREADS)
        InterceptDiscussion.itcFetchUnAnsweredThread.wait()
        cy.wait(2000)
        discussionDetail.verifyUnAnswerThreadDisplayInAscending()
      })
    })
  })
})
