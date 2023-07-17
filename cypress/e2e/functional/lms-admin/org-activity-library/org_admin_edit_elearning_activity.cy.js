import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import CourseActivitiesActions from '../../../../classes/lms-admin/course-instance-activities/admin/actions/CourseActivitiesActions'
import CourseActivitiesAssertions from '../../../../classes/lms-admin/course-instance-activities/admin/assertions/CourseActivitiesAssertions'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  const activitiesLibraryYamlStub = new ActivitiesLibraryYamlStub()
  const activityLibraryActions = new ActivityLibraryActions()
  const activityLibraryAssertions = new ActivityLibraryAssertions()
  const courseActivitiesActions = new CourseActivitiesActions()
  const courseActivitiesAssertions = new CourseActivitiesAssertions()

  context(Story.organizationActivityLibrary, () => {
    let course
    let instance
    let activity
    let oldActivity
    let newActivity

    before(() => {
      activitiesLibraryYamlStub.getCourseFuncActivityFromLibrary((data) => {
        course = data
        instance = data.funcSOActivityElearningEdit
      })
      activitiesLibraryYamlStub.getSOActivityElearningEdit((data) => {
        activity = data
        oldActivity = activity.previous
        newActivity = activity.edit
      })
    })

    after(() => {
      ReportDefect.markCwDefect('Slow performance for create elearning activity')
    })

    it('Org admin edit eLearning Activity (Standard Activity) - Org Library', () => {
      Story.ticket('QA-1917', ['CW-17406'])

      SignInAs.orgAdmin_Amy()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Update Activity To Original Data')
      activityLibraryActions.editActivityIfExist(newActivity.title, oldActivity)

      cy.logInTestCase('Edit Activity')
      activityLibraryActions.editActivity(newActivity, oldActivity.title)

      cy.logInTestCase('Verify Activity Updated Successfully')
      activityLibraryAssertions.expectToSeeFileUploadedSuccessfully([
        newActivity.uploadLessonPackage.name,
      ])
      activityLibraryAssertions.verifyActivityInfoWithStandardTemplateInEditMode(newActivity)

      cy.logInTestCase('Verify Instance Activity Reflect To New Update Of Activity Library')
      courseActivitiesActions.visitCourseInstanceActivities(course, instance)
      courseActivitiesActions.clickThreeDotEditActivity(newActivity.title)
      courseActivitiesAssertions.verifyActivityInfoUsingActivityTemplate(newActivity)
    })
  })
})
