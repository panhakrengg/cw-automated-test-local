import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import CourseCreation from '../../../../classes/lms/CourseCreation'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Field from '../../../../classes/constants/Field'

describe(Epic.LmsTrainingCop, { retries: 1 },() => {
  context(Story.manageCourse, () => {
    const courseCreation = new CourseCreation()
    const yamlHelper = new YamlHelper('lms-training-cop/courses/create-course')
    let copManageCourse
    let createCourse

    before(() => {
      yamlHelper
        .read()
        .its('CreateCourse')
        .then((data) => {
          createCourse = data
          SignInAs.copAdmin()
          copManageCourse = new CopManageCourse(createCourse.courseWithoutBanner)
        })
      yamlHelper.setNewPath('lms-training-cop/cop-info')
      yamlHelper
        .read()
        .its('CopInfo.trainingCop.learnTennis.url')
        .then((url) => copManageCourse.setCopAdminUrl(url[new Environment().getEnvYaml()]))
    })

    it('CoP Admin create new course without banner image', () => {
      Story.ticket('QA-906')

      context('Create course without banner image', () => {
        courseCreation.goToCreateCoursePage(createCourse['creationCourse']['url'][new Environment().getEnvYaml()])
        courseCreation.defineAliasFormElements()
        courseCreation.create(createCourse['courseWithoutBanner'])
        copManageCourse.setCourse(createCourse['courseWithoutBanner'])
      })

      context('will redirect to course overview with default banner image', () => {
        copManageCourse.verifyCourseOverview()
      })

      context('Will display in Draft & All, but not in Current & Completed Draft/all', () => {
        copManageCourse.goToManageCourse()
        copManageCourse.searchCourseWithFilter(Field.CURRENT)
        copManageCourse.verifyManageCourseEmptyState()
        copManageCourse.searchCourseWithFilter(Field.COMPLETED)
        copManageCourse.verifyManageCourseEmptyState()
        copManageCourse.searchCourseWithFilter(Field.ALL)
        copManageCourse.verifyCourseExistsInManageCourse()
        copManageCourse.searchCourseWithFilter(Field.DRAFT)
        copManageCourse.verifyCourseExistsInManageCourse()
      })

      context('Clean up data', () => {
        copManageCourse.deleteCourse()
      })
    })
  })
})
