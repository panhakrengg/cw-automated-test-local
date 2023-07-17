import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  context(Story.manageCourse, () => {
    const copManageCourse = new CopManageCourse()
    const yamlHelper = new YamlHelper('lms-training-cop/publish-unpublish-course')
    let faker

    before(() => {
      yamlHelper
        .read()
        .its('CourseData.scoreInTennis')
        .then((course) => {
          copManageCourse.setCourse(course)
          yamlHelper.setNewPath('lms-training-cop/cop-info')
          yamlHelper
            .read()
            .its('CopInfo.trainingCop.learnTennis.url')
            .then((url) => copManageCourse.setCopAdminUrl(url[new Environment().getEnvYaml()]))
          faker = new Faker(copManageCourse.getCourse())
          SignInAs.copAdmin()
        })
    })

    it('CoP Admin able to publish/unpublish course', () => {
      Story.ticket('QA-1016', ['CW-10317'])

      copManageCourse.goToCourseOverview(faker.getUrlId())
      copManageCourse._itcFetchCourses
        .getResponse()
        .its('response.body.result.published')
        .then((published) => {
          copManageCourse.verifyPublishAndUnpublishCourse(!published)
          cy.wrap(null).then(() => copManageCourse.verifyPublishAndUnpublishCourse(published))
        })
    })
  })
})
