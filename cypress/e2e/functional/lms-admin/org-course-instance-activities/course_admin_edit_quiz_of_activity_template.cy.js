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
    let courseActivityTitleUpdate
    let courseActivityDesc

    before(() => {
      courseActivitiesYamlStub.getCourseFuncActivityFromLibrary((data) => {
        course = data
        courseInstance = course.funcTOActivityQuizInstanceEdit
        courseActivity = courseInstance.activities.value.tOActivityQuizInstanceEdit
        courseActivityTitle = courseActivity.title
        courseActivityTitleUpdate = courseActivityTitle + ' ' + 'Update'
        courseActivityDesc = courseActivity.description
      })
    })

    after(() => {
      ReportDefect.markAsBETACwDefect(
        'CW-18135: Missing moodle activity overview data for fresh new created + Rich Text'
      )
    })

    it('[Org Course Instance] Learning Admin edit Quiz (Activity Template)', () => {
      Story.ticket('QA-1635', ['CW-18135'])
      signInLmsAs.lnAdmin_Emery()
      courseActivitiesActions.visitCourseInstanceActivities(course, courseInstance)

      cy.logInTestCase('Reset Data: Update Course Activity To Original Data')
      courseActivitiesActions.updateCourseActivityTemplateIfExist(
        courseActivityTitleUpdate,
        courseActivityTitle
      )

      cy.logInTestCase('Update Course Activity')
      courseActivitiesActions.updateCourseActivityTemplate(
        courseActivityTitle,
        courseActivityTitleUpdate
      )

      cy.logInTestCase('Verify Activity Updated Successfully')
      courseActivitiesActions.expandActivityAccordionByTitle(courseActivityTitleUpdate)
      courseActivitiesAssertions.expectAddedNewActivityToInstanceSuccessfully(
        courseActivityTitleUpdate,
        courseActivityDesc
      )

      cy.logInTestCase('Verify Search Original Activity In Library And Found')
      activityLibraryActions.visitActivityLibrary()
      activityLibraryActions.searchActivity(courseActivityTitle)
      activityLibraryAssertions.expectToSeeActivityTitle(courseActivityTitle)

      cy.logInTestCase('Verify Search Update Activity In Library And Show Not Found')
      activityLibraryActions.searchActivity(courseActivityTitleUpdate)
      activityLibraryAssertions.expectToSeeNoResultFound()
    })
  })
})
