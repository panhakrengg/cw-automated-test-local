import Discussion from '../../../../classes/constants/Discussion'
import Notification from '../../../../classes/discussion/base-discussion/Notification'
import DiscussionDetail from '../../../../classes/discussion/member/DiscussionDetail'
import Epic from '../../../../classes/Epic'
import CourseDiscussion from '../../../../classes/lms/learner/course-instance/CourseDiscussion'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, { retries: 2 }, () => {
  const courseDiscussion = new CourseDiscussion()
  const discussionDetail = new DiscussionDetail()
  const webNotification = new WebNotification()
  const manageCourses = new ManageCourses()
  const notification = new Notification()
  const faker = new Faker()
  const signInAsLms = new SignInLmsAs()

  context(Story.discussion, () => {
    let course
    let courseId
    let instanceId
    let firstThread
    let firstThreadSubject
    let secondThread
    let secondThreadSubject
    let malloryUser
    let delphiaUser

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
          firstThread = NewThreads.firstSameCategory
          firstThreadSubject = firstThread.subject
          secondThread = NewThreads.secondSameCategory
          secondThreadSubject = secondThread.subject
        })
      new YamlHelper('users-orgmgt').read().then(({ Users }) => {
        malloryUser = Users.uat.auLnIstMem_Mallory
        delphiaUser = Users.uat.auLnIstMem_Delphia
      })
    })

    it('2 Instance Members create threads in the same category and admin check notification', () => {
      Story.ticket('QA-1771')

      context('Create new first thread', () => {
        signInAsLms.istMember_Mallory()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        discussionDetail.removeThreadIfExist(firstThreadSubject)
        discussionDetail.createThread(firstThread)
      })

      context('Create new second thread', () => {
        signInAsLms.istMember_Delphia()
        courseDiscussion.entryPointAccessViaUrl(instanceId)
        discussionDetail.removeThreadIfExist(secondThreadSubject)
        discussionDetail.createThread(secondThread)
      })

      context(
        `Instance lead facilitator received notifications from ${malloryUser.fullName}`,
        () => {
          signInAsLms.istLeadFaci_Amina()
          webNotification.clickOnWebNotificationIcon()
          notification.verifyUserCreateNewThreadWebNotification(
            malloryUser.fullName,
            course.name,
            firstThreadSubject
          )
        }
      )

      context(
        `Instance lead facilitator received notifications from ${delphiaUser.fullName}`,
        () => {
          notification.verifyUserCreateNewThreadWebNotification(
            delphiaUser.fullName,
            course.name,
            secondThreadSubject
          )
        }
      )

      context('Reset data', () => {
        manageCourses.itcAddVisitDiscussionActivity.set()
        manageCourses.accessCourseInstanceBy(courseId, instanceId, Discussion.DISCUSSIONS)
        manageCourses.itcAddVisitDiscussionActivity.wait()
        discussionDetail.setThreadSubject(firstThreadSubject)
        discussionDetail.removeThreadIfExist(firstThreadSubject)
        cy.wait(3000)
        discussionDetail.setThreadSubject(secondThreadSubject)
        discussionDetail.removeThreadIfExist(secondThreadSubject)
      })
    })
  })
})
