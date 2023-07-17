import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  context(Story.manageCourse, () => {
    const copManageCourse = new CopManageCourse()
    const yamlHelper = new YamlHelper('lms-training-cop/cop-info')

    before(() => {
      yamlHelper
        .read()
        .its('CopInfo.trainingCop.learnTennis.url')
        .then((url) => {
          copManageCourse.setCopAdminUrl(url[new Environment().getEnvYaml()])
          SignInAs.copMember()
        })
    })

    it('CoP Member able to see page not found when access to manage course', () => {
      Story.ticket('QA-959', ['CW-16516'])

      copManageCourse.visitManageCourse({ failOnStatusCode: false })
      copManageCourse.expectToSeePageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
