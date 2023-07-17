import Discussion from '../../../../classes/constants/Discussion'
import MoveThreadPopUp from '../../../../classes/discussion/base-discussion/MoveThreadPopUp'
import ThreadDetails from '../../../../classes/discussion/base-discussion/ThreadDetail'
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
  const moveThreadPopUp = new MoveThreadPopUp()
  const threadDetails = new ThreadDetails()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    let course
    let instanceId
    let thread
    let threadSubject
    let parentCategory
    let previousCategory
    let newCategory

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
          thread = SampleDiscussion.threads.learner_MalloryMove
          threadSubject = thread.subject
          parentCategory = SampleDiscussion.categories.movingCtg
          previousCategory = SampleDiscussion.categories.previousCtgThread
          newCategory = SampleDiscussion.categories.newCtgThread
          discussionDetail.setThreadSubject(threadSubject)
          moveThreadPopUp.setThreadSubject(threadSubject)
        })
    })

    it("Thread's owner move thread into new category", () => {
      Story.ticket('QA-1774')

      context('Entry point', () => {
        signInAsLms.istMember_Mallory()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Prepare data', () => {
        discussionDetail.getThreadViaSubject().then(($thread) => {
          if ($thread.find(`span:contains("${newCategory.name}")`).length) {
            moveThreadPopUp.clickMoveThreeDot()
            moveThreadPopUp.selectCategory(previousCategory.name)
            moveThreadPopUp.clickMoveCategoryButton()
          }
        })
      })

      context('Move thread to new category', () => {
        moveThreadPopUp.clickMoveThreeDot()
        moveThreadPopUp.selectCategory(newCategory.name)
        moveThreadPopUp.clickMoveCategoryButton()
      })

      context('Could see alert message', () => {
        moveThreadPopUp.verifyShowAlertSuccess()
      })

      context('Verify thread not exist in previous category', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
        discussionDetail.clickCategoryByName(parentCategory.name)
        discussionDetail.clickCategoryByName(previousCategory.name)
        discussionDetail.verifyThreadNotExist(threadSubject)
      })

      context('Verify thread exist in new category', () => {
        threadDetails.clickBackIcon()
        discussionDetail.clickCategoryByName(newCategory.name)
        discussionDetail.verifyThreadSubject(threadSubject)
      })

      context('Reset data', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.RECENT)
        moveThreadPopUp.clickMoveThreeDot(threadSubject)
        moveThreadPopUp.selectCategory(previousCategory.name)
        moveThreadPopUp.clickMoveCategoryButton()
      })
    })
  })
})
