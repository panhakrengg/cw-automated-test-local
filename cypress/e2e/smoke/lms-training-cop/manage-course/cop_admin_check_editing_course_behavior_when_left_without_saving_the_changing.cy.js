import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import CourseCreation from '../../../../classes/lms/CourseCreation'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Field from '../../../../classes/constants/Field'

describe(Epic.LmsTrainingCop, () => {
  let course
  let courseId
  const faker = new Faker()
  const copManageCourse = new CopManageCourse()
  const courseCreation = new CourseCreation()
  courseCreation.setTrainingLmsBannerFixture()
  courseCreation.setTrainingLmsFileFixture()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const yamlHelper = new YamlHelper('/lms-training-cop/courses/edit-course-behavior')
  before(() => {
    yamlHelper.read().then(({ EditCourseBehavior }) => {
      course = EditCourseBehavior.scoreInTennis
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
    })
    lmsTCoPMock.setAdminLearnTennisUrl(copManageCourse)
  })
  context(Story.manageCourse, () => {
    it('CoP Admin check editing course behavior when left without saving the changing', () => {
      context('Verify no prompt popup, if no changing', () => {
        SignInAs.copAdmin()
        copManageCourse.goToEditCourse(courseId)
        copManageCourse.clickOnOverviewTab()
        cy.expectNoSwal2Popup()
      })

      context('Verify prompt popup, if have changing', () => {
        copManageCourse.goToEditCourse(courseId)
        courseCreation.edit(course)
        copManageCourse.clickOnTab(Field.OVERVIEW)
        copManageCourse.expectToSeeConfirmLeavePromptPopup()
      })

      context('Verify stay on this page in prompt popup', () => {
        copManageCourse.clickOnTab(Field.OVERVIEW)
        cy.swal2().swal2Cancel('Stay on this page').click()
        copManageCourse.expectStayOnTab('Edit Course')
      })

      context('Verify leave this page in prompt popup', () => {
        copManageCourse.clickOnTab(Field.OVERVIEW)
        cy.swal2().swal2Confirm('Leave this page').click()
        copManageCourse.expectNotStayOnTab('Edit Course')
      })
    })
  })
})
