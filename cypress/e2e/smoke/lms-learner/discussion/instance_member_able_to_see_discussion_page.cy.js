import Discussion from '../../../../classes/constants/Discussion'
import MoveThreadPopUp from '../../../../classes/discussion/base-discussion/MoveThreadPopUp'
import RemoveThreadPopUp from '../../../../classes/discussion/base-discussion/RemoveThreadPopUp'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const moveThreadPopUp = new MoveThreadPopUp()
  const removeThreadPopUp = new RemoveThreadPopUp()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    let course
    let sampleDiscussionData
    let threads
    let categories
    let learnerMalloryMoveThreadSubject
    let adminFacilitatorReplyHasSubscriberThreadSubject
    let learnerDelphiaNoSubscribeThreadSubject
    let learnerDelphiaLikeThreadSubject
    let learnerDelphiaDislikeThreadSubject
    let welcomeThreadCategory
    let movingCtg
    let uncategorised
    let newCtgThread
    let previousCtgThread

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        discussionDetail.setCourse(course)
        courseDiscussion.setCourse(course)
      })

      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ SampleDiscussion }) => {
          sampleDiscussionData = SampleDiscussion
          threads = sampleDiscussionData.threads
          learnerMalloryMoveThreadSubject = threads.learner_MalloryMove.subject
          adminFacilitatorReplyHasSubscriberThreadSubject =
            threads.admin_FacilitatorReplyHasSubscriber.subject
          learnerDelphiaNoSubscribeThreadSubject = threads.learner_Delphia_NoSubscribe.subject
          learnerDelphiaLikeThreadSubject = threads.learner_Delphia_like.subject
          learnerDelphiaDislikeThreadSubject = threads.learner_Delphia_dislike.subject
          categories = sampleDiscussionData.categories
          welcomeThreadCategory = categories.welcomeThread
          uncategorised = categories.uncategorised
          movingCtg = categories.movingCtg
          newCtgThread = categories.newCtgThread
          previousCtgThread = categories.newCtgThread
        })

      discussionDetail.setComponentType(Discussion.DISCUSSIONS)
    })

    it('Instance Member able to see Discussion page', () => {
      Story.ticket('QA-1759')

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion._entryPoint()
      })

      context('Verify Recent', () => {
        discussionDetail._verifyCourseHeader()
        discussionDetail._verifyComponentHeader()
        discussionDetail._verifyLeftSidebarItems()
        discussionDetail._verifyCardHeaders(discussionDetail._recentCardHeader)
        discussionDetail._verifySelectToView()

        context("Verify thread's three dot options by permission", () => {
          discussionDetail.setThreadSubject(learnerMalloryMoveThreadSubject)
          discussionDetail.verifyThreadThreeDotOptions([Discussion.SUBSCRIBE])

          discussionDetail.setThreadSubject(adminFacilitatorReplyHasSubscriberThreadSubject)
          discussionDetail.verifyThreadThreeDotOptions([Discussion.UNSUBSCRIBE])

          discussionDetail.setThreadSubject(learnerDelphiaNoSubscribeThreadSubject)
          discussionDetail.verifyThreadThreeDotOptions([
            Discussion.EDIT,
            Discussion.MOVE,
            Discussion.SUBSCRIBE,
            Discussion.REMOVE,
          ])

          discussionDetail.setThreadSubject(learnerDelphiaLikeThreadSubject)
          discussionDetail.verifyThreadThreeDotOptions([
            Discussion.EDIT,
            Discussion.MOVE,
            Discussion.UNSUBSCRIBE,
            Discussion.REMOVE,
          ])
        })

        context('Verify move thread popup', () => {
          discussionDetail.setThreadSubject(learnerDelphiaLikeThreadSubject)
          discussionDetail.selectThreadThreeDotBy(Discussion.MOVE)
          moveThreadPopUp.verifyMoveThreadPopUp([
            categories.uncategorised.name,
            categories.forEveryone.name,
            categories.movingCtg.name,
            categories.newCtgThread.name,
            categories.previousCtgThread.name,
            categories.nonsubscriber.name,
            categories.welcomeThread.name,
          ])
        })

        context('Verify remove thread popup', () => {
          discussionDetail.setThreadSubject(learnerDelphiaLikeThreadSubject)
          discussionDetail.selectThreadThreeDotBy(Discussion.REMOVE)
          removeThreadPopUp.verifyRemoveThreadPopUp()
        })
      })

      context('Verify My Threads', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.MY_THREADS)
        discussionDetail._verifyComponentHeader()
        discussionDetail._verifyCardHeaders(discussionDetail._myThreadCardHeader)
        discussionDetail._verifyThreadSubjects(
          learnerDelphiaLikeThreadSubject,
          learnerDelphiaDislikeThreadSubject,
          learnerDelphiaNoSubscribeThreadSubject
        )
      })

      context('Verify My Subscriptions', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
        discussionDetail._verifyComponentHeader()
        discussionDetail._verifyCardHeaders(discussionDetail._mySubscriptionsCardHeader)
        discussionDetail._verifyThreadSubjects(
          learnerDelphiaLikeThreadSubject,
          learnerDelphiaDislikeThreadSubject,
          adminFacilitatorReplyHasSubscriberThreadSubject
        )
      })

      context('Verify All Categories', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
        discussionDetail._verifyComponentHeader()
        discussionDetail._verifyCardHeaders(discussionDetail._allCategoriesCardHeader)
        discussionDetail._verifyCategoryButtonNotExist()
        discussionDetail._verifyCategorySubjects(welcomeThreadCategory.name, uncategorised.name)
      })

      context('Verify on Any Category', () => {
        discussionDetail.clickCategoryByName(movingCtg.name)
        discussionDetail._verifyCardHeaders(discussionDetail._subCategoriesCardHeader)
        discussionDetail._verifyUnSelectableCategorySubject(movingCtg.name)
        discussionDetail._verifyCategorySubjects(newCtgThread.name, previousCtgThread.name)
      })
    })
  })
})
