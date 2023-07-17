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
    let learnerDelphiaNoSubscribeThread
    let editLearnerDelphiaNoSubscribeThread
    let attachments
    let uncategorisedName
    let canDiscussHereForEveryoneCategoryName

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        course = CourseData.resourcesNotesDiscussion
        faker.setPathFixture(course.discussion)
        instanceId = faker.getUrlId()
        courseDiscussion.setCourse(course)
      })

      new YamlHelper('lms/course-instances/discussion/sample-discussion')
        .read()
        .then(({ SampleDiscussion, EditThread }) => {
          learnerDelphiaNoSubscribeThread = SampleDiscussion.threads.learner_Delphia_NoSubscribe
          editLearnerDelphiaNoSubscribeThread = EditThread.learner

          uncategorisedName = learnerDelphiaNoSubscribeThread.category.name
          canDiscussHereForEveryoneCategoryName = editLearnerDelphiaNoSubscribeThread.category.name

          attachments = learnerDelphiaNoSubscribeThread.attachmentsName.filter(
            (val) => !editLearnerDelphiaNoSubscribeThread.removeAttachments.includes(val)
          )
          attachments.push(editLearnerDelphiaNoSubscribeThread.newAttachmentsName[0])
        })
    })

    it('Instance Member edit thread', () => {
      Story.ticket('QA-1769')

      context('Entry point', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
      })

      context('Prepare thread', () => {
        discussionDetail.resetThread(
          editLearnerDelphiaNoSubscribeThread,
          learnerDelphiaNoSubscribeThread
        )
      })

      context('Edit thread', () => {
        discussionDetail.editThread(
          learnerDelphiaNoSubscribeThread,
          editLearnerDelphiaNoSubscribeThread
        )
        editLearnerDelphiaNoSubscribeThread.attachmentsName = attachments
        threadDetails.verifyThreadDetails(editLearnerDelphiaNoSubscribeThread, false)
        threadDetails.clickBackIcon()
      })

      context('Verify thread not under old category', () => {
        discussionDetail.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
        discussionDetail.clickCategoryByName(uncategorisedName)
        discussionDetail.verifyThreadNotExist(editLearnerDelphiaNoSubscribeThread.subject)
      })

      context('Verify thread under new category', () => {
        threadDetails.clickBackIcon()
        discussionDetail.clickCategoryByName(canDiscussHereForEveryoneCategoryName)
        discussionDetail.verifyThreadItemCardDetail(
          editLearnerDelphiaNoSubscribeThread.subject,
          canDiscussHereForEveryoneCategoryName,
          currentDate,
          false
        )
      })

      context('Reset data', () => {
        discussionDetail.resetThread(
          editLearnerDelphiaNoSubscribeThread,
          learnerDelphiaNoSubscribeThread
        )
      })
    })
  })
})
