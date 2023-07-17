import Epic from '../../../../classes/Epic'
import CourseActivitiesActions from '../../../../classes/lms-admin/course-instance-activities/admin/actions/CourseActivitiesActions'
import CourseActivitiesAssertions from '../../../../classes/lms-admin/course-instance-activities/admin/assertions/CourseActivitiesAssertions'
import CourseActivitiesYamlStub from '../../../../classes/lms-admin/course-instance-activities/admin/stub/CourseActivitiesYamlStub'
import Story from '../../../../classes/Story'
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
        courseInstance = course.funcSPActivityElearning
      })
      courseActivitiesYamlStub.getSPActivityElearningOrg((data) => {
        courseActivity = data
        courseActivityTitle = courseActivity.title
        courseActivityDesc
      })
    })

    it('[Org course Instance] Course Admin creates activity (elearning) by choosing Public Library &Template = Standard Activity', () => {
      Story.ticket('QA-1912')
      signInLmsAs.couAdmin_Tressie()
      courseActivitiesActions.visitCourseInstanceActivities(course, courseInstance)

      cy.logInTestCase('Reset Data: Remove Course Activity')
      courseActivitiesActions.deleteCourseActivity(courseActivityTitle)

      cy.logInTestCase('Create E-Learning Activity')
      courseActivitiesActions.addNewELearningCourseActivity()
      courseActivitiesActions.addCourseActivityFromActivityLibrary(courseActivityTitle)

      cy.logInTestCase('Verify Added Activity From Activity Library Successfully')
      courseActivitiesAssertions.expectAddedExistingActivityFromLibrarySuccessfully(courseActivity)

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
