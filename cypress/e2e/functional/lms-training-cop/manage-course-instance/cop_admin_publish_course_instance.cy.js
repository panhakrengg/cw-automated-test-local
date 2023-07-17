import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import PublishUnPublishCourse from '../../../../classes/lms/PublishUnPublishCourse'
import WebNotification from '../../../../classes/notification/WebNotification'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let courseId
  let courseInstanceId
  let courseName
  let courseDate
  const userName = 'au_copadmin'
  const faker = new Faker()
  const webNotification = new WebNotification()
  const copManageCourse = new CopManageCourse()
  const publishUnPublishCourse = new PublishUnPublishCourse()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/publish-instance')
  before(() => {
    yamlHelper.read().then(({ CourseData }) => {
      const course = CourseData.tennisByYourself
      const courseInstance = CourseData.tennisByYourself.courseInstances.publishInstance

      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      faker.setPathFixture(courseInstance)
      courseInstanceId = faker.getUrlId()
      copManageCourse.setCourse(course)
      courseDate = courseInstance.date
      courseName = course.name
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin publish course instance', () => {
      Story.ticket('QA-1028')

      context('Reset Data: Make sure Course Instance is unpublished', () => {
        SignInAs.copAdmin()
        copManageInstance.goToInstanceOverview(courseId, courseInstanceId)
        publishUnPublishCourse.unPublishCourseInstance()
      })

      context('CoP Admin publish course instance', () => {
        copManageInstance.goToInstanceOverview(courseId, courseInstanceId)
        publishUnPublishCourse.publishCourseInstance()
      })

      context('Current instances will able to see published instance with status Published', () => {
        copManageCourse.setCopAdminUrl(CoPConst.URL)
        copManageCourse._itcFetchCourse.set()
        copManageCourse.visitManageCourse()
        copManageCourse._itcFetchCourse.wait()
        copManageCourse.searchCourseWithFilter()
        copManageCourse.expectToSeeInstanceByDate(courseDate)
        copManageCourse.expectToSeeInstanceByStatus('Published')
      })

      context('Draft instances will not able to see published instance', () => {
        copManageCourse.searchCourseWithFilter(Field.DRAFT)
        copManageCourse.expectNotToSeeInstanceByDate(courseDate)
      })

      context('Another admin: check notification and see updated instance notification', () => {
        SignInAs.reSignInAsCopAdminSecond()
        copManageCourse._itcCourseInstanceOverview.set()
        webNotification
          .getNotificationOfUpdatedAnInstanceInTheCourse(userName, courseName)
          .should('be.visible')
          .click()
        copManageCourse._itcCourseInstanceOverview.wait()
      })

      context('Another Admin: Instance overview will display with Toggle turn ON', () => {
        publishUnPublishCourse.expectPublished()
      })
    })
  })
})
