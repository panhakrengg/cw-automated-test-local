import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  context(Story.manageCourse, () => {
    const copManageCourse = new CopManageCourse()

    before(() => {
      new YamlHelper('lms-training-cop/cop-info')
        .read()
        .its('CopInfo.trainingCop.learnTennis.url')
        .then((url) => {
          copManageCourse.setCopAdminUrl(url[new Environment().getEnvYaml()])
        })
    })

    it('CoP Admin sort course by Course Name', () => {
      Story.ticket('QA-960')

      cy.logInTestCase('Login as Cop Admin')
      SignInAs.copAdmin()

      cy.logInTestCase('Go to manage course')
      copManageCourse.goToManageCourse()

      cy.logInTestCase('Verify sort course by title ascending')
      copManageCourse.verifySortCoursesByTitle()

      cy.logInTestCase('Verify sort course by title descending')
      copManageCourse.verifySortCoursesByTitle(true)
    })
  })
})
