import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import CourseCreation from '../../../../classes/lms/CourseCreation'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Field from '../../../../classes/constants/Field'

describe(Epic.LmsTrainingCop, () => {
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
          copManageCourse = new CopManageCourse(createCourse.courseWithBanner)
        })
      yamlHelper.setNewPath('lms-training-cop/cop-info')
      yamlHelper
        .read()
        .its('CopInfo.trainingCop.learnTennis.url')
        .then((url) => copManageCourse.setCopAdminUrl(url[new Environment().getEnvYaml()]))
    })

    it('CoP Admin create new course with banner image', () => {
      Story.ticket('QA-907')

      context('Create course with banner image', () => {
        courseCreation.goToCreateCoursePage(createCourse['creationCourse']['url'][new Environment().getEnvYaml()])
        courseCreation.defineAliasFormElements()
        courseCreation.setTrainingLmsBannerFixture()
        courseCreation.create(createCourse['courseWithBanner'])
        copManageCourse.setCourse(createCourse['courseWithBanner'])
      })

      context('will redirect to course overview with new banner image', () => {
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
        copManageCourse.deleteCoursesInDraft()
      })
    })
  })
})
