import moment from 'moment'
import Discussion from '../../../../classes/constants/Discussion'
import ThreadDetails from '../../../../classes/discussion/base-discussion/ThreadDetail'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import DateFormat from '../../../../classes/format-collections/DateFormat'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const faker = new Faker()
  const threadDetails = new ThreadDetails()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    const currentDate = moment().format(DateFormat.THREAD_MODIFIED_DATE_FORMAT)
    let course
    let instanceId
    let uncategorisedName
    let underUncategorisedThread
    let underUncategorisedThreadSubject

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        courseDiscussion.setCourse(course)
      })

      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ NewThreads, SampleDiscussion }) => {
          underUncategorisedThread = NewThreads.underUncategorised
          underUncategorisedThreadSubject = underUncategorisedThread.subject
          uncategorisedName = SampleDiscussion.categories.uncategorised.name
          discussionDetail.setThreadSubject(underUncategorisedThreadSubject)
        })
    })

    it('Instance Member create new thread under uncategorised', () => {
      Story.ticket('QA-1752')

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Remove thread if exist', () => {
        discussionDetail.removeThreadIfExist(underUncategorisedThreadSubject)
      })

      context('Create new thread', () => {
        discussionDetail.createThread(underUncategorisedThread)
      })

      context('Verify thread details', () => {
        threadDetails.verifyThreadDetails(underUncategorisedThread)
        threadDetails.verifyThreadThreeDotOptions([
          Discussion.EDIT,
          Discussion.MOVE,
          Discussion.UNSUBSCRIBE,
          Discussion.REMOVE,
        ])
      })

      context('Verify thread in All Categories', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
        discussionDetail.clickCategoryByName(uncategorisedName)
        discussionDetail.verifyThreadItemCardDetail(
          underUncategorisedThreadSubject,
          uncategorisedName,
          currentDate
        )
      })

      context('Reset data', () => {
        discussionDetail.removeThread()
      })
    })
  })
})
