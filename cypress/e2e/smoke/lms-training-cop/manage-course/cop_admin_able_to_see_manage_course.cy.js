import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Field from '../../../../classes/constants/Field'

describe(Epic.LmsTrainingCop, () => {
  context(Story.manageCourse, () => {
    const faker = new Faker()
    const yamlHelper = new YamlHelper('lms-training-cop/publish-unpublish-course')
    let copManageCourse
    let courseData

    before(() => {
      yamlHelper
        .read()
        .its('CourseData')
        .then((data) => {
          courseData = data
          yamlHelper.setNewPath('lms-training-cop/cop-info')
          yamlHelper
            .read()
            .its('CopInfo.trainingCop.learnTennis.url')
            .then((url) => copManageCourse.setCopAdminUrl(url[new Environment().getEnvYaml()]))
          SignInAs.copAdmin()
          copManageCourse = new CopManageCourse(courseData.scoreInTennis)
        })
    })

    it('CoP Admin able to see courses in manage course', () => {
      Story.ticket('QA-956')

      context('Course "Typed Racket" - no course instance', () => {
        copManageCourse.setCourse(courseData['typedRacket'])
        faker.setPathFixture(copManageCourse.getCourse())
        copManageCourse.goToManageCourse()
        copManageCourse.verifyFilterAndSortOptions()
        copManageCourse.searchCourseWithFilter(Field.ALL)
        copManageCourse.verifyCourse3DotsAndDeleteConfirm(true)
      })

      context('Course "A Score in tennis" - has course instance', () => {
        cy.wrap(null).then(() => {
          copManageCourse.setCourse(courseData['scoreInTennis'])
          faker.setPathFixture(copManageCourse.getCourse())
          copManageCourse.goToManageCourse(true)
          copManageCourse.searchCourseWithFilter(Field.ALL)
          copManageCourse.verifyCourse3DotsAndDeleteConfirm()
          const courseId = faker.getUrlId()
          copManageCourse.goToCourseOverview(courseId)
          copManageCourse.verifyCourseOverview()
          copManageCourse.goToEditCourse(courseId)
          copManageCourse.verifyEditCourse()
        })
      })
    })
  })
})
