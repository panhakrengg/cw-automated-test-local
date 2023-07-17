import CourseMock from '../../../../classes/course/CourseMock'
import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import CourseCreation from '../../../../classes/lms/CourseCreation'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 },() => {
  context(Story.manageCourse, () => {
    const lmsTCoPMock = new LmsTrainingCopMock()
    const courseMock = new CourseMock()
    const courseCreation = new CourseCreation()
    const yamlHelper = new YamlHelper('lms-training-cop/courses/edit-course')

    let copManageCourse
    let screenName, courseData, editCourse, courseId
    let isRevertCourse = true
    const updateCourse = (afterUpdate) => {
      if (!afterUpdate) {
        cy.get('@inputCourseTitle').then((inputTitle) => {
          if (inputTitle.val().includes('Updated')) {
            const backUpTagSkill = courseData['tagSkill']
            courseData['tagSkill'] = editCourse['tagSkill']
            courseCreation.update(courseData)
            courseData['tagSkill'] = backUpTagSkill
            copManageCourse.goToEditCourse(courseId, true)
          }
        })
        return
      }
      copManageCourse.goToEditCourse(courseId)
      courseData['tagSkill'] = editCourse['tagSkill']
      courseCreation.update(courseData)
    }

    before(() => {
      courseCreation.setTrainingLmsBannerFixture()
      courseCreation.setTrainingLmsFileFixture()
      yamlHelper.read().then(({ CourseData, EditCourse }) => {
        courseData = CourseData['tennisWarmUpGuide']
        editCourse = EditCourse['tennisWarmUpGuide']
        copManageCourse = new CopManageCourse(editCourse)
        lmsTCoPMock.setAdminLearnTennisUrl(copManageCourse)
        copManageCourse.setCourse(courseData)
        courseId = courseMock.getId(courseData)
      })

      cy.wrap(null).then(() => {
        yamlHelper.setNewPath('users')
        yamlHelper
          .read()
          .its('CoPUsers.admin.users.uat')
          .then(({ screenNames }) => {
            screenName = screenNames[0]
          })
      })
    })

    it('CoP Admin edit course', () => {
      Story.ticket('QA-961')
      SignInAs.copAdmin()
      copManageCourse.goToEditCourse(courseId)
      courseCreation.update(editCourse, updateCourse)

      courseCreation.expectSaveCourseToastMessage()
      copManageCourse.expectStayOnEditCoursePage(courseId)
      courseCreation.expectSaveCourseButtonDisabled()

      copManageCourse.setCourse(editCourse)
      copManageCourse.goToManageCourse()
      copManageCourse.verifyCourseCardInManageCourse()
      copManageCourse.verifyUpdatedCourseWebNotification(screenName, courseId)
      copManageCourse.verifyCourseOverview()

      context('Reset Data', () => {
        copManageCourse.goToEditCourse(courseId)
        updateCourse(isRevertCourse)
      })
    })
  })
})
