import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CourseActivitiesActions from '../../../../classes/lms-admin/course-instance-activities/admin/actions/CourseActivitiesActions'
import CourseActivitiesAssertions from '../../../../classes/lms-admin/course-instance-activities/admin/assertions/CourseActivitiesAssertions'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import TCopActivityLibraryBase from '../../../../classes/lms-training-cop/admin/activity-library/TCopActivityLibraryBase'

describe(Epic.LmsTrainingCop, () => {
  const activityLibraryBase = new TCopActivityLibraryBase()
  const courseActivitiesAssertions = new CourseActivitiesAssertions()
  const courseActivitiesActions = new CourseActivitiesActions()

  context(Story.tCopActivityLibrary, () => {
    let cop, activity, courseId, instanceId, oldActivity, newActivity, copManageInstance

    before(() => {
      activityLibraryBase.yaml.getEditCopCourseFuncActivityLibraryCourse((data) => {
        cop = data.trainingCoP
        courseId = activityLibraryBase.yaml.getUrlId(data)
        instanceId = activityLibraryBase.yaml.getUrlId(data.instanceFuncEditMoodleAssignment)
        activity = data.trainingCoP.activityLibrary.tCActivityAssignmentEdit
        oldActivity = activity.previous
        newActivity = activity.new
        copManageInstance = new CopManageInstance(cop.admin.url)
      })
    })

    it('CoP Owner edits usage Assignment with Template Activity - CoP Library', () => {
      Story.ticket('QA-1617')

      cy.logInTestCase('Login and visit TCop admin activity library')
      activityLibraryBase.login.copOwnerKristy(cop.admin.url)

      cy.logInTestCase('Reset Data: Update Activity To Original Data')
      activityLibraryBase.orgActions.editMoodleActivityIfExist(newActivity.title, oldActivity)

      cy.logInTestCase('Edit Activity')
      activityLibraryBase.orgActions.editMoodleActivity(oldActivity.title, newActivity)

      cy.logInTestCase('Verify Activity Updated Successfully')
      activityLibraryBase.orgAssertions.verifyMoodleActivityWithActivityTemplate(newActivity)
      activityLibraryBase.orgActions.clickBackLinkIcon()
      activityLibraryBase.orgActions.searchActivity(newActivity.title)
      activityLibraryBase.orgAssertions.expectToSeeNewAssignmentActivityInLibrary(newActivity)

      cy.logInTestCase(
        'Verify Instance Activity Not Reflect To New Update Of Moodle Activity Library'
      )
      copManageInstance.goToInstanceCourseActivity(courseId, instanceId)
      courseActivitiesActions.clickThreeDotEditActivity(oldActivity.title)
      courseActivitiesAssertions.verifyActivityInfoUsingActivityTemplate(oldActivity)
    })
  })
})
