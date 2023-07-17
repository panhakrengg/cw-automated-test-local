import Discussion from '../../../../classes/constants/Discussion'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    const searchKeyword = 'admin'
    let course
    let instanceId

    before(() => {
      discussionDetail.setComponentType(Discussion.DISCUSSIONS)
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        discussionDetail.setCourse(course)
        courseDiscussion.setCourse(course)
      })
    })

    it('Instance Member search discussion', () => {
      Story.ticket('QA-1768')

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Verify search discussions', () => {
        discussionDetail.search(searchKeyword)
        discussionDetail.verifyAllListItemsContainSearchKeywords(searchKeyword)
      })

      context('Verify showing total results', () => {
        discussionDetail.verifyThreadHeaderContainsCorrectTotalNumber()
        discussionDetail.verifyCategoryHeaderContainsCorrectTotalNumber()
      })
    })
  })
})
