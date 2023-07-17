import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import InstanceOverview from '../../../../classes/lms-training-cop/InstanceOverview'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import WebNotification from '../../../../classes/notification/WebNotification'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let instance
  let courseId
  let courseName
  const faker = new Faker()
  const userName = 'au_copadmin'
  const instanceOverview = new InstanceOverview()
  const webNotification = new WebNotification()
  const copManageCourse = new CopManageCourse()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/create-instance')
  before(() => {
    yamlHelper.read().then(({ CourseData, CreateEmptyInstances }) => {
      const course = CourseData.newCourseInstanceFunc
      courseName = course.name
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      instance = CreateEmptyInstances.selfStudy
      copManageInstance.setCourseAndInstance(course, instance)
      instanceOverview.setCourseAndInstance(course, instance)
      copManageCourse.setCourse(course)
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin create new course instance as Self Study without add info', () => {
      Story.ticket('QA-913')

      cy.logInTestCase('SignIn as Cop admin and navigate to course instance')
      SignInAs.copAdmin()
      copManageInstance.goToCourseInstances(courseId)

      cy.logInTestCase('Reset data')
      copManageInstance.archiveInstancesByDate()
      copManageInstance.deleteArchiveInstancesByDate()

      cy.logInTestCase('Create default course instance without add info')
      copManageInstance.goToCreateInstance(courseId)
      copManageInstance.clickOnSaveInstance()

      cy.logInTestCase('View new instance')
      instanceOverview.verifyNewInstanceOverview()

      cy.logInTestCase('Expect to see created course instance')
      copManageInstance.clickOnBackIcon()
      copManageInstance.expectToSeeInstanceByDate()

      cy.logInTestCase('Back to course')
      copManageInstance._itcFetchCourse.set()
      cy.clickBackLink()
      cy.wait(1000)
      copManageInstance._itcFetchCourse.wait()

      cy.logInTestCase('Filter course and expect to see created instance')
      copManageCourse.searchCourseWithFilter(Field.ALL)
      copManageCourse.expectToSeeInstanceByDate()

      cy.logInTestCase('Another CoP admin verify the new course instance created')
      SignInAs.reSignInAsCopAdminSecond()
      copManageCourse._itcFetchCourseActivities.set()
      webNotification
        .getNotificationOfCreateAnInstanceInTheCourse(userName, courseName)
        .should('be.visible')
        .click()
      copManageCourse._itcFetchCourseActivities.wait()
      instanceOverview.verifyNewInstanceOverview()
    })
  })
})
