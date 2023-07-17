import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import CourseActivitiesActions from '../../../../classes/lms-admin/course-instance-activities/admin/actions/CourseActivitiesActions'
import CourseActivitiesAssertions from '../../../../classes/lms-admin/course-instance-activities/admin/assertions/CourseActivitiesAssertions'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, { tags: ['@skipFeatureChange'] }, () => {
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
        instance = data.funEditAssignmentActivity
      })
      activitiesLibraryYamlStub.getTOActivityAssignmentEdit((data) => {
        activity = data
        oldActivity = activity.previous
        newActivity = activity.edit
      })
    })

    it('Edit assignment Activity Library (Activity Template) - Org Library', () => {
      Story.ticket('QA-1908')

      SignInAs.orgAdmin_Amy()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Update Activity To Original Data')
      activityLibraryActions.editMoodleActivityIfExist(newActivity.title, oldActivity)

      cy.logInTestCase('Edit Activity')
      activityLibraryActions.editMoodleActivity(oldActivity.title, newActivity)

      cy.logInTestCase('Verify Activity Updated Successfully')
      activityLibraryAssertions.verifyMoodleActivityWithActivityTemplate(newActivity)
      activityLibraryActions.clickBackLinkIcon()
      activityLibraryActions.searchActivity(newActivity.title)
      activityLibraryAssertions.expectToSeeNewAssignmentActivityInLibrary(newActivity)

      cy.logInTestCase(
        'Verify Instance Activity Not Reflect To New Update Of Moodle Activity Library'
      )
      courseActivitiesActions.visitCourseInstanceActivities(course, instance)
      courseActivitiesActions.clickThreeDotEditActivity(oldActivity.title)
      courseActivitiesAssertions.verifyActivityInfoUsingActivityTemplate(oldActivity)
    })
  })
})
