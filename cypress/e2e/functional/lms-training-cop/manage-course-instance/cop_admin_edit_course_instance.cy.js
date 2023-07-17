import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import InstanceOverview from '../../../../classes/lms-training-cop/InstanceOverview'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import WebNotification from '../../../../classes/notification/WebNotification'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let courseId
  let courseName
  let courseInstanceId
  let courseInstance
  let courseInstanceEdit

  const faker = new Faker()
  const instanceOverview = new InstanceOverview()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)

  before(() => {
    new YamlHelper('lms-training-cop/course-instances/edit-instance')
      .read()
      .then(({ CourseData, EditInstance }) => {
        const course = CourseData.tennisWarmUpGuide
        courseName = course.name
        courseInstance = course.courseInstances.editInstance
        faker.setPathFixture(course)
        courseId = faker.getUrlId()
        faker.setPathFixture(courseInstance)
        courseInstanceId = faker.getUrlId()

        courseInstanceEdit = EditInstance.tennisWarmUpGuide.courseInstances.editInstance
        instanceOverview.setCourseAndInstance(course, courseInstanceEdit)
      })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin edit course instance', () => {
      Story.ticket('QA-1122')

      cy.logInTestCase('Login as cop admin then navigate into edit course instance')
      SignInAs.copAdmin()
      copManageInstance.goToEditInstance(courseId, courseInstanceId)

      cy.logInTestCase('Reset data')
      copManageInstance.setInstance(courseInstance)
      copManageInstance.editInstance()
      copManageInstance.removeLanguage()
      copManageInstance.clickOnSaveInstance()

      cy.logInTestCase('CoP admin edit course instance')
      copManageInstance.setInstance(courseInstanceEdit)
      copManageInstance.editInstance()
      copManageInstance.addLanguage()
      copManageInstance.clickOnSaveInstance()
      copManageInstance.clickOnBackIcon()
      copManageInstance.expectToSeeInstanceByDate()

      cy.logInTestCase('Another CoP admin verify instance updated')
      SignInAs.reSignInAsCopAdminSecond()
      copManageInstance._itcFetchCourseActivities.set()
      new WebNotification()
        .getNotificationOfUpdatedAnInstanceInTheCourse('au_copadmin', courseName)
        .click()
      copManageInstance._itcFetchCourseActivities.wait()
      instanceOverview.verifyInstanceOveview()
    })
  })
})
