import { Lms } from '../../../../classes/constants/Lms'
import Epic from '../../../../classes/Epic'
import CourseInstanceOverviewActions from '../../../../classes/lms-admin/course-instance/admin/actions/CourseInstanceOverviewActions'
import ManageCourseActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseActions'
import ManageCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseInstanceActions'
import ModifyCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ModifyCourseInstanceActions'
import LearningActions from '../../../../classes/lms-admin/course-instance/learner/actions/LearningActions'
import LearningAssertions from '../../../../classes/lms-admin/course-instance/learner/assertions/LearningAssertions'
import LearningQueries from '../../../../classes/lms-admin/course-instance/learner/queries/LearningQueries'
import CourseInstanceYamlStub from '../../../../classes/lms-admin/course-instance/stub/CourseInstanceYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const courseInstanceYamlStub = new CourseInstanceYamlStub()
  const manageCourseInstanceActions = new ManageCourseInstanceActions()
  const manageCourseActions = new ManageCourseActions()
  const learningActions = new LearningActions()
  const learningQueries = new LearningQueries()
  const learningAssertions = new LearningAssertions()
  const modifyCourseInstanceActions = new ModifyCourseInstanceActions()
  const courseInstanceOverviewActions = new CourseInstanceOverviewActions()

  context(Story.courseInstance, { retries: 1 }, () => {
    let course
    let courseId
    let courseName
    let courseInstance
    let courseInstanceTitle
    let oldTotalItems

    before(() => {
      courseInstanceYamlStub.getCourseFuncForNewInstance((data) => {
        course = data
        courseInstance = data.instanceLanguage
        courseName = data.name.value
        courseInstanceTitle = courseInstance.title.value
        courseId = courseInstanceYamlStub.getUrlId(course)
      })
    })

    function learnerGoToCourseCatalogAndExpandLanguageFilter() {
      signInLmsAs.ctgMember_Quentin()
      learningActions.visitLearning()
      learningActions.switchToCourseCatalog()
      learningActions.expandFilterByCategoryType(Lms.languages)
    }

    it('Course Admin creates course instance with available language then Learner view', () => {
      Story.ticket('QA-1856')

      cy.logInTestCase('Preset Data - Course Admin delete course instance')
      signInLmsAs.couAdmin_Tressie()
      manageCourseInstanceActions.visitManageCourseInstanceByCourseId(courseId)
      manageCourseInstanceActions.archiveAndDeleteCourseInstance(courseInstanceTitle)

      cy.logInTestCase('Learner check language not exist')
      learnerGoToCourseCatalogAndExpandLanguageFilter()
      learningQueries.getTotalFilterItemsByCategoryType(Lms.languages).then(($oldTotalItems) => {
        oldTotalItems = $oldTotalItems
      })
      learningAssertions.expectNotToSeeFilterItemByCategoryType(Lms.languages, Lms.polishLanguage)

      cy.logInTestCase('Course Admin create course instance')
      signInLmsAs.couAdmin_Tressie()
      manageCourseActions.visitManageCourse()
      manageCourseActions.searchCourse(courseName)
      manageCourseActions.clickThreeDotCreateCourseInstanceForCourse(courseName)
      modifyCourseInstanceActions.createCourseInstance(courseInstance)
      courseInstanceOverviewActions.publishCourseInstanceWithoutActivity()
      cy.wait(30000) //System unstable

      cy.logInTestCase('Learner expect to see new language added to filter')
      learnerGoToCourseCatalogAndExpandLanguageFilter()
      learningAssertions.expectToSeeFilterItemByCategoryType(Lms.languages, Lms.polishLanguage)
      learningQueries.getTotalFilterItemsByCategoryType(Lms.languages).then(($newTotalItems) => {
        expect(parseInt($newTotalItems)).to.gt(parseInt(oldTotalItems))
      })
    })
  })
})
