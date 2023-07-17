import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import CourseCreation from '../../../../classes/lms/CourseCreation'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  context(Story.manageCourse, () => {
    const courseCreation = new CourseCreation()
    const yamlHelper = new YamlHelper('lms-training-cop/courses/create-course')
    let courseUrl

    before(() => {
      yamlHelper
        .read()
        .its('CreateCourse.creationCourse.url')
        .then((url) => {
          courseUrl = url[new Environment().getEnvYaml()]
          SignInAs.copAdmin()
        })
    })

    it('CoP Admin check required filed in create new course', () => {
      Story.ticket('QA-963')

      courseCreation.goToCreateCoursePage(courseUrl)
      courseCreation.verifyRequiredFields()
    })
  })
})
