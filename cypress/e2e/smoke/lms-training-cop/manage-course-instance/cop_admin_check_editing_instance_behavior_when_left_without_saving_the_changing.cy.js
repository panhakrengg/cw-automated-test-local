import Epic from '../../../../classes/Epic'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let courseInstanceId
  let courseInstance
  const faker = new Faker()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  const yamlHelper = new YamlHelper('/lms-training-cop/course-instances/edit-instance-behavior')
  before(() => {
    yamlHelper.read().then(({ CourseData, EditInstanceBehavior }) => {
      faker.setPathFixture(CourseData.scoreInTennis)
      courseId = faker.getUrlId()
      courseInstance = EditInstanceBehavior.scoreInTennis.courseInstances.noActivity
      faker.setPathFixture(courseInstance)
      courseInstanceId = faker.getUrlId()
      copManageInstance.setInstance(courseInstance)
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin check editing instance behavior when left without saving the changing', () => {
      Story.ticket('QA-1025')
      SignInAs.copAdmin()
      context('Verify no prompt popup, if not edit course instance', () => {
        copManageInstance.goToEditInstance(courseId, courseInstanceId)
        copManageInstance.clickOnInstanceOverviewTab()
        copManageInstance.expectNoPromptPopup()
      })
      context('Verify prompt popp, if have changed the course instance', () => {
        copManageInstance.clickOnEditInstanceTab()
        copManageInstance.editInstance()
        copManageInstance.verifyPromptPopup()
      })
      context('Verify stay on this page in prompt popup', () => {
        copManageInstance.verifyStayOnThisPage()
      })
      context('Verify leave this page in prompt popup', () => {
        copManageInstance.verifyLeaveThisPage()
      })
    })
  })
})
