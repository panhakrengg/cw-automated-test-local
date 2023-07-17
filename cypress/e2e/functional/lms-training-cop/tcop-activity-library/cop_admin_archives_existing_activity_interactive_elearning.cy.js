import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CourseInstanceOverviewAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/CourseInstanceOverviewAssertions'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import TCopActivityLibraryBase from '../../../../classes/lms-training-cop/admin/activity-library/TCopActivityLibraryBase'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  const activityLibraryBase = new TCopActivityLibraryBase()
  const courseInstanceOverviewAssertions = new CourseInstanceOverviewAssertions()

  context(Story.tCopActivityLibrary, () => {
    let cop, activity, activityTitle, courseId, instanceId, copManageInstance

    before(() => {
      activityLibraryBase.yaml.getArchiveCopCourseFuncActivityLibraryCourse((data) => {
        cop = data.trainingCoP
        courseId = activityLibraryBase.yaml.getUrlId(data)
        instanceId = activityLibraryBase.yaml.getUrlId(data.instanceFuncArchiveElearning)
        activity = data.trainingCoP.activityLibrary.sCActivityElearningArchive
        activityTitle = activity.title
        copManageInstance = new CopManageInstance(cop.admin.url)
      })
    })

    it('CoP Admin archives existing activity Interactive eLearning - CoP Library', () => {
      Story.ticket('QA-1618')

      cy.logInTestCase('Login and visit TCop admin activity library')
      activityLibraryBase.login.copAdminBettye(cop.admin.url)

      cy.logInTestCase('Reset Data: Unarchive course activity')
      activityLibraryBase.orgActions.clickDropdownFilterArchivedAndSearchActivity(activityTitle)
      activityLibraryBase.orgActions.clickThreeDotUnArchiveActivityIfExist(activityTitle)

      cy.logInTestCase('Archive course activity')
      activityLibraryBase.orgActions.clickDropdownFilterCommunityLibraryAndSearchActivity(
        activityTitle
      )
      activityLibraryBase.orgActions.clickThreeDotArchiveActivity(activityTitle)
      activityLibraryBase.orgAssertions.expectToSeeNoResultFound()

      cy.logInTestCase('Verify archived activity show only in archive list')
      activityLibraryBase.orgActions.clickDropdownFilterArchivedAndSearchActivity(activityTitle)
      activityLibraryBase.orgAssertions.expectToSeeNewELearningActivityInLibrary(activity)

      cy.logInTestCase('Verify archived activity still show in course instance')
      copManageInstance.goToInstanceOverview(courseId, instanceId)
      courseInstanceOverviewAssertions.expectToSeeActivityWithTitle(activityTitle)
    })
  })
})
