import Epic from '../../../../classes/Epic'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import ManageCourseActivity from '../../../../classes/lms/admin/course-instance/ManageCourseActivity'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  const faker = new Faker()
  const mangeCourseActivity = new ManageCourseActivity()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)

  let courseData
  let courseId
  let courseInstanceId
  let courseInstance
  let copAdminScreenName

  before(() => {
    new YamlHelper('lms-training-cop/course-instances/course-activities')
      .read()
      .then(({ CourseData }) => {
        courseData = CourseData.tennisWarmUpGuide
        faker.setPathFixture(courseData)
        courseId = faker.getUrlId()
        courseInstance = courseData.courseInstances.modifyMoodle
        faker.setPathFixture(courseInstance)
        courseInstanceId = faker.getUrlId()
      })
    new YamlHelper('users').read().then(({ Users }) => {
      copAdminScreenName = Users.uat.wpAdmin.screenName
    })
  })

  context(Story.manageCourseInstance, () => {
    it('CoP Admin re-order course activities', () => {
      Story.ticket('QA-1081')
      cy.logInTestCase('Redirect to mange course page')
      SignInAs.copAdmin()
      copManageInstance.goToInstanceOverview(courseId, courseInstanceId)
      if (Cypress.currentRetry == 1) {
        cy.logInTestCase('Reset Data: Revert Reorder course activity')
        copManageInstance.clickOnInstanceCourseActivityTab()
        mangeCourseActivity._revertReorderCourseActivity()
      }
      copManageInstance.clickOnInstanceCourseActivityTab()
      mangeCourseActivity._reorderCourseActivity()
      mangeCourseActivity._expectToSeeCourseActivityChangeOrder()

      cy.logInTestCase('Another CoP admin verify notification instance updated')
      SignInAs.reSignInAsCopAdminSecond()
      copManageInstance._itcFetchCourses.set()
      new WebNotification()
        .getNotificationOfUpdatedAnInstanceInTheCourse(copAdminScreenName, courseData.name)
        .click()
      copManageInstance._itcFetchCourses.wait()
      mangeCourseActivity._expectToSeeCourseActivityChangeOrder()

      cy.logInTestCase('Reset Data: Revert Reorder course activity')
      copManageInstance.clickOnInstanceCourseActivityTab()
      mangeCourseActivity._revertReorderCourseActivity()
    })
  })
})
