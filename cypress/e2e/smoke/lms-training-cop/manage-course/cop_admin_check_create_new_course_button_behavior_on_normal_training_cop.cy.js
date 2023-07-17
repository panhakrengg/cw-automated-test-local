import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import HelpGuidesHome from '../../../../classes/help-guides/home/HelpGuidesHome'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import CourseCreation from '../../../../classes/lms/CourseCreation'
import Story from '../../../../classes/Story'
import QuickTip from '../../../../classes/utilities/QuickTip'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  context(Story.manageCourse, () => {
    let copManageCourse = new CopManageCourse()
    const courseCreation = new CourseCreation()
    const quickTip = new QuickTip()
    const helpGuideHome = new HelpGuidesHome()
    const yamlHelper = new YamlHelper('lms-training-cop/cop-info')

    before(() => {
      yamlHelper
        .read()
        .its('CopInfo.trainingCop.paintingPictures.url')
        .then((url) => copManageCourse.setCopAdminUrl(url[new Environment().getEnvYaml()]))
      yamlHelper.setNewPath('validation/quick-tip')
      yamlHelper
        .read()
        .its('QuickTip.createNewCourse')
        .then((createNewCourse) => quickTip.setTemplate(createNewCourse))
    })

    it('CoP Admin check Create New Course button behavior on normal training cop', () => {
      Story.ticket('QA-1363')

      SignInAs.copAdmin()
      copManageCourse.goToManageCourse()

      cy.logInTestCase('Verify Creating New Course screen')
      courseCreation.clickCreateNewCourse()
      copManageCourse.verifyCreateCourseOnNormalCop()

      cy.logInTestCase('Verify Quick tip')
      quickTip.verifyQuickTip()
      helpGuideHome.interceptFilter()
      helpGuideHome.viewWholePage()
    })
  })
})
