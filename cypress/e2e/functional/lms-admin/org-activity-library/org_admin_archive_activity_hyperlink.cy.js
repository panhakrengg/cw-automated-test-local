import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import CourseInstanceOverviewActions from '../../../../classes/lms-admin/course-instance/admin/actions/CourseInstanceOverviewActions'
import CourseInstanceOverviewAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/CourseInstanceOverviewAssertions'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  const activitiesLibraryYamlStub = new ActivitiesLibraryYamlStub()
  const activityLibraryActions = new ActivityLibraryActions()
  const activityLibraryAssertions = new ActivityLibraryAssertions()
  const courseInstanceOverviewActions = new CourseInstanceOverviewActions()
  const courseInstanceOverviewAssertions = new CourseInstanceOverviewAssertions()

  context(Story.organizationActivityLibrary, () => {
    let courseId
    let courseInstanceId
    let activity
    let activityTitle

    before(() => {
      activitiesLibraryYamlStub.getCourseFuncActivityFromLibrary((data) => {
        courseId = activitiesLibraryYamlStub.getUrlId(data)
        courseInstanceId = activitiesLibraryYamlStub.getUrlId(data.funArchiveUnarchiveActivity)
      })
      activitiesLibraryYamlStub.getTOActivityHyperlinkArchive((data) => {
        activity = data
        activityTitle = activity.title
      })
    })

    it('[Org LIBRARY] Org admin archive Activity (hyperlink)', () => {
      Story.ticket('QA-1870')

      SignInAs.orgAdmin_Amy()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Unarchive course activity')
      activityLibraryActions.clickDropdownFilterArchivedAndSearchActivity(activityTitle)
      activityLibraryActions.clickThreeDotUnArchiveActivityIfExist(activityTitle)

      cy.logInTestCase('Archive course activity')
      activityLibraryActions.clickDropdownFilterActivityLibraryAndSearchActivity(activityTitle)
      activityLibraryActions.clickThreeDotArchiveActivity(activityTitle)
      activityLibraryAssertions.expectToSeeNoResultFound()

      cy.logInTestCase('Verify archived activity show only in archive list')
      activityLibraryActions.clickDropdownFilterArchivedAndSearchActivity(activityTitle)
      activityLibraryAssertions.expectToSeeNewHyperlinkActivityInLibrary(activity, false)

      cy.logInTestCase('Verify archived activity still show in course instance')
      courseInstanceOverviewActions.visitCourseInstanceOverviewByInstanceId(
        courseId,
        courseInstanceId
      )
      courseInstanceOverviewAssertions.expectToSeeActivityWithTitle(activityTitle)
    })
  })
})
