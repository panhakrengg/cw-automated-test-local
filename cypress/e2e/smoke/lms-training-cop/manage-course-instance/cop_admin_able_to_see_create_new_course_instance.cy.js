import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import Epic from '../../../../classes/Epic'
import HelpGuidesHome from '../../../../classes/help-guides/home/HelpGuidesHome'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import ModifyCourseInstance from '../../../../classes/lms/admin/course-instance/ModifyCourseInstance'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  const faker = new Faker()
  const helpGuideHome = new HelpGuidesHome()
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/create-instance')
  before(() => {
    SignInAs.copAdmin()
    yamlHelper.read().then(({ CourseData }) => {
      faker.setPathFixture(CourseData.newCourseInstanceFunc)
      copManageInstance.goToCourseInstances(faker.getUrlId())
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin able to see create new course instance', () => {
      Story.ticket('QA-1017')

      copManageInstance.clickOnCreateNewInstance()

      cy.logInTestCase('Verify Default delivery method')
      copManageInstance.expectDeliveryMethodSelected(DeliveryMethod.SELF_STUDY)

      cy.logInTestCase('Verify Self-study method')
      copManageInstance.verifySelfStudyDeliveryMethodFields()

      cy.logInTestCase('Verify Virtual Classroom method')
      copManageInstance.selectDeliveryMethodAndVerifyFields(DeliveryMethod.VIRTUAL_CLASSROOM)

      cy.logInTestCase('Verify Physical Classroom method')
      copManageInstance.selectDeliveryMethodAndVerifyFields(DeliveryMethod.PHYSICAL_CLASSROOM)

      cy.logInTestCase('Verify Blended Learning method')
      copManageInstance.selectDeliveryMethodAndVerifyFields(DeliveryMethod.BLENDED_LEARNING)

      cy.logInTestCase('Verify confirm leave this page popup')
      copManageInstance.verifyLeaveThisPagePopup()

      cy.logInTestCase('Verify Quick Tip')
      helpGuideHome.interceptFilter()
      new ModifyCourseInstance().expectQuickTip()
      helpGuideHome.viewWholePage()
    })
  })
})
