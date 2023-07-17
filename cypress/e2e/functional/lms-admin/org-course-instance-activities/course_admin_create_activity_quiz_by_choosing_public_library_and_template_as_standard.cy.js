import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CourseActivitiesActions from '../../../../classes/lms-admin/course-instance-activities/admin/actions/CourseActivitiesActions'
import CourseActivitiesAssertions from '../../../../classes/lms-admin/course-instance-activities/admin/assertions/CourseActivitiesAssertions'
import CourseActivitiesYamlStub from '../../../../classes/lms-admin/course-instance-activities/admin/stub/CourseActivitiesYamlStub'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const courseActivitiesYamlStub = new CourseActivitiesYamlStub()
  const courseActivitiesActions = new CourseActivitiesActions()
  const courseActivitiesAssertions = new CourseActivitiesAssertions()

  context(Story.organizationCourseInstanceActivities, () => {
    let course
    let courseInstance
    let courseActivity
    let courseActivityTitle
    let courseActivityTitleUpdate
    let courseActivityDesc

    before(() => {
      courseActivitiesYamlStub.getCourseFuncActivityFromLibrary((data) => {
        course = data
        courseInstance = course.funcTPActivityQuiz
      })
      courseActivitiesYamlStub.getTPActivityQuizOrg((data) => {
        courseActivity = data
        courseActivityTitle = courseActivity.title
        courseActivityTitleUpdate = 'AU ' + courseActivityTitle
        courseActivityDesc = courseActivity.description
      })
    })

    after(() => {
      ReportDefect.markAsBETACwDefect(
        'CW-18135: Missing moodle activity overview data for fresh new created + Rich Text'
      )
    })

    it('[Org course Instance] Course Admin creates activity (quiz) by choosing Public Library & Template = Activity Template', () => {
      Story.ticket('QA-1631', ['CW-18135'])
      signInLmsAs.couAdmin_Tressie()
      courseActivitiesActions.visitCourseInstanceActivities(course, courseInstance)

      cy.logInTestCase('Reset Data: Remove Course Activity')
      courseActivitiesActions.deleteCourseActivity(courseActivityTitleUpdate)

      cy.logInTestCase('Create Quiz Activity')
      courseActivitiesActions.addNewQuizCourseActivity()
      courseActivitiesActions.addCourseActivityFromActivityLibrary(courseActivityTitle)

      cy.logInTestCase('Verify Added Activity From Activity Library Successfully')
      courseActivitiesAssertions.expectAddedExistingActivityFromLibrarySuccessfully(
        courseActivity,
        true
      )

      cy.logInTestCase('Update Activity Title And Save Course Activity')
      courseActivitiesActions.clickEditDetails()
      courseActivitiesActions.inputActivityTitle(courseActivityTitleUpdate)
      courseActivitiesActions.clickSaveUpdatedActivity()

      cy.logInTestCase('Verify Added Activity To Instance Successfully')
      courseActivitiesActions.expandActivityAccordionByTitle(courseActivityTitleUpdate)
      courseActivitiesAssertions.expectAddedNewActivityToInstanceSuccessfully(
        courseActivityTitleUpdate,
        courseActivityDesc
      )
    })
  })
})
