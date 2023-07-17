import Field from '../../../../classes/constants/Field'
import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
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
  const activityLibraryActions = new ActivityLibraryActions()
  const activityLibraryAssertions = new ActivityLibraryAssertions()

  context(Story.organizationCourseInstanceActivities, () => {
    let course
    let courseInstance
    let courseActivity
    let courseActivityTitle
    let courseActivityDesc
    let courseActivityTitleUpdate
    let courseActivityDescUpdate
    const scoreLimitUpdate = 0.5

    before(() => {
      courseActivitiesYamlStub.getCourseFuncActivityToLibrary((data) => {
        course = data
        courseInstance = course.funcAddElearningToLibrary
        courseActivity = courseInstance.activities.value.activityElearningToLibrary
        courseActivityTitle = courseActivity.title
        courseActivityDesc = courseActivity.description
        courseActivityTitleUpdate = 'AU ' + courseActivityTitle
        courseActivityDescUpdate = 'AU ' + courseActivityDesc
      })
    })

    after(() => {
      ReportDefect.markAsUATCwDefect('Slow performance for create elearning activity')
    })

    it('[Org Course Instance] Learning Admin add activity from course instance to Activity Library', () => {
      Story.ticket('QA-1637', ['CW-17406'])
      signInLmsAs.lnAdmin_Emery()

      cy.logInTestCase('Reset Data: Remove Course Activity From Activity Library')
      activityLibraryActions.visitActivityLibrary()
      activityLibraryActions.deleteActivityFromLibraryIfFound(courseActivityTitleUpdate)

      cy.logInTestCase('Add Course Activity To Activity Library')
      courseActivitiesActions.visitCourseInstanceActivities(course, courseInstance)
      courseActivitiesActions.addActivityToLibrary(courseActivityTitle)

      cy.logInTestCase('Modify Activity Library')
      activityLibraryActions.modifyCourseActivityInActivityLibrary({
        title: courseActivityTitleUpdate,
        description: courseActivityDescUpdate,
        scoreLimit: scoreLimitUpdate,
      })
      activityLibraryAssertions.expectToSeeSaveActivitySuccessfullyToast()

      cy.logInTestCase('Verify Activity Saved To Activity Library')
      activityLibraryActions.clickBackLinkIcon()
      activityLibraryActions.searchActivity(courseActivityTitleUpdate)
      activityLibraryAssertions.expectToSeeNewELearningActivityInLibrary({
        title: { new: courseActivityTitleUpdate },
      })

      cy.logInTestCase('Verify Course Activity Still Have Link for choosing template')
      courseActivitiesActions.visitCourseInstanceActivities(course, courseInstance)
      courseActivitiesActions.expandActivityAccordionByTitle(courseActivityTitle)
      courseActivitiesAssertions.expectAddedNewActivityToInstanceSuccessfully(
        courseActivityTitle,
        courseActivityDesc
      )

      cy.logInTestCase('Verify Quiz in edit activity')
      courseActivitiesActions.clickActivityThreeDotItem(courseActivityTitle, Field.EDIT)
      courseActivitiesAssertions.expectToSeeLinkForChooseActivityTemplateInEditActivity(
        courseActivityTitle
      )
    })
  })
})
