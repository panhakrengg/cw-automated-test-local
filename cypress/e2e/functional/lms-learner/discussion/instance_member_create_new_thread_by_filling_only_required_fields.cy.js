import moment from 'moment'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Discussion from '../../../../classes/constants/Discussion'
import ThreadDetails from '../../../../classes/discussion/base-discussion/ThreadDetail'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import DateFormat from '../../../../classes/format-collections/DateFormat'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

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
    let categories
    let uncategorised
    let uncategorisedName
    let onlyRequiredFieldThread
    let onlyRequiredFieldThreadSubject

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
          onlyRequiredFieldThread = NewThreads.onlyRequiredField
          onlyRequiredFieldThreadSubject = onlyRequiredFieldThread.subject
          categories = SampleDiscussion.categories
          uncategorised = categories.uncategorised
          uncategorisedName = uncategorised.name
          discussionDetail.setThreadSubject(onlyRequiredFieldThreadSubject)
        })
    })

    it('Instance Member creates a new thread by filling only the required field', () => {
      Story.ticket('QA-1779')

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Remove thread if exist', () => {
        discussionDetail.removeThreadIfExist(onlyRequiredFieldThreadSubject)
      })

      context('Create new thread', () => {
        discussionDetail.clickNewThreadButton()
        discussionDetail.fillInSubject(onlyRequiredFieldThread.subject)
        discussionDetail.clickPublishButton()
        threadDetails.verifyThreadDetails(onlyRequiredFieldThread, uncategorised)
        threadDetails.clickBackIcon()
      })

      context('Recent', () => {
        discussionDetail.verifyCreatedDate(currentDate)
        discussionDetail.verifyHasNewIndicator()
      })

      context('Click My Thread', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.MY_THREADS)
        discussionDetail.verifyThreadItemCardDetail(
          onlyRequiredFieldThreadSubject,
          uncategorisedName,
          currentDate
        )
      })

      context('Click My Subscriptions', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
        discussionDetail.verifyThreadItemCardDetail(
          onlyRequiredFieldThreadSubject,
          uncategorisedName,
          currentDate
        )
      })

      context('Click All Categories', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
        discussionDetail.clickCategoryByName(uncategorisedName)
        discussionDetail.verifyThreadItemCardDetail(
          onlyRequiredFieldThreadSubject,
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
