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
    let course
    let instanceId
    let thread

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        discussionDetail.setCourse(course)
      })

      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ SampleDiscussion }) => {
          thread = SampleDiscussion.threads.learner_Delphia_CountView
          discussionDetail.setThreadSubject(thread.subject)
        })
    })

    it('Instance Member check view thread increase', () => {
      Story.ticket('QA-1768')

      context('Entry point', () => {
        signInAsLms.istMember_Mallory()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Check view thread increase', () => {
        discussionDetail.verifyViewThreadIncrease()
      })
    })
  })
})
