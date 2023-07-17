import { Lms } from '../../../../classes/constants/Lms'
import Epic from '../../../../classes/Epic'
import CourseActivitiesActions from '../../../../classes/lms-admin/course-instance-activities/admin/actions/CourseActivitiesActions'
import CourseActivitiesAssertions from '../../../../classes/lms-admin/course-instance-activities/admin/assertions/CourseActivitiesAssertions'
import CourseActivitiesYamlStub from '../../../../classes/lms-admin/course-instance-activities/admin/stub/CourseActivitiesYamlStub'
import Story from '../../../../classes/Story'
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
    let courseActivityDesc

    before(() => {
      courseActivitiesYamlStub.getCourseFuncActivityFromLibrary((data) => {
        course = data
        courseInstance = course.funcSOActivityHyperlink
      })
      courseActivitiesYamlStub.getAuSOActivityHyperlinkCw((data) => {
        courseActivity = data
        courseActivityTitle = courseActivity.title
        courseActivityDesc = courseActivity.description
      })
    })

    after(() => {
      ReportDefect.markAsBETACwDefect(
        'CW-18135: Missing moodle activity overview data for fresh new created + Rich Text'
      )
    })

    it('[Org Course Instance] Course Admin create activity (hyperlink) by choosing Organization Library and Template as Standard Activity', () => {
      Story.ticket('QA-1911', ['CW-18135'])
      signInLmsAs.couAdmin_Tressie()
      courseActivitiesActions.visitCourseInstanceActivities(course, courseInstance)

      cy.logInTestCase('Reset Data: Remove Course Activity')
      courseActivitiesActions.deleteCourseActivity(courseActivityTitle)

      cy.logInTestCase('Create Hyperlink Activity')
      courseActivitiesActions.addNewHyperlinkCourseActivity()
      courseActivitiesActions.addCourseActivityFromActivityLibrary(
        courseActivityTitle,
        Lms.organizationLibrary
      )

      cy.logInTestCase('Verify Added Activity From Activity Library Successfully')
      courseActivitiesAssertions.expectAddedExistingActivityFromLibrarySuccessfully(courseActivity)
      courseActivitiesAssertions.expectToSeeCannotModifiableMessage()

      cy.logInTestCase('Save Course Activity')
      courseActivitiesActions.clickSaveUpdatedActivity()

      cy.logInTestCase('Verify Added Activity To Instance Successfully')
      courseActivitiesActions.expandActivityAccordionByTitle(courseActivityTitle)
      courseActivitiesAssertions.expectAddedNewActivityToInstanceSuccessfully(
        courseActivityTitle,
        courseActivityDesc
      )
    })
  })
})
