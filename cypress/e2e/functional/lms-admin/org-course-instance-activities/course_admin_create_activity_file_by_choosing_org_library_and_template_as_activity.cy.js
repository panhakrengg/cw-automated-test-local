import { Lms } from '../../../../classes/constants/Lms'
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

  context(Story.organizationCourseInstanceActivities, { retries: 1 }, () => {
    let course
    let courseInstance
    let courseActivity
    let courseActivityTitle
    let courseActivityTitleUpdate
    let courseActivityDescUpdate

    before(() => {
      courseActivitiesYamlStub.getCourseFuncActivityFromLibrary((data) => {
        course = data
        courseInstance = course.funcTOActivityFileImage
      })
      courseActivitiesYamlStub.getTOActivityImage((data) => {
        courseActivity = data
        courseActivityTitle = courseActivity.title
        courseActivityTitleUpdate = 'AU ' + courseActivityTitle
        courseActivityDescUpdate = 'AU ' + courseActivity.description
      })
    })

    it('[Org course instance] Course Admin creates activity (file) by choosing Organization Library and Template as Activity template', () => {
      Story.ticket('QA-1630')
      signInLmsAs.couAdmin_Tressie()
      courseActivitiesActions.visitCourseInstanceActivities(course, courseInstance)

      cy.logInTestCase('Reset Data: Remove Course Activity')
      courseActivitiesActions.deleteCourseActivity(courseActivityTitleUpdate)

      cy.logInTestCase('Create File Activity')
      courseActivitiesActions.addNewFileCourseActivity()
      courseActivitiesActions.addCourseActivityFromActivityLibrary(
        courseActivityTitle,
        Lms.organizationLibrary
      )

      cy.logInTestCase('Verify Added Activity From Activity Library Successfully')
      courseActivitiesAssertions.expectAddedExistingActivityFromLibrarySuccessfully(
        courseActivity,
        true
      )

      cy.logInTestCase('Update Activity Title, Description And Save Course Activity')
      courseActivitiesActions.clickEditDetails()
      courseActivitiesActions.inputActivityTitle(courseActivityTitleUpdate)
      courseActivitiesActions.inputActivityDescription(courseActivityDescUpdate)
      courseActivitiesActions.clickSaveUpdatedActivity()

      cy.logInTestCase('Verify Added Activity To Instance Successfully')
      courseActivitiesActions.expandActivityAccordionByTitle(courseActivityTitleUpdate)
      courseActivitiesAssertions.expectAddedNewActivityToInstanceSuccessfully(
        courseActivityTitleUpdate,
        courseActivityDescUpdate
      )
    })
  })
})
