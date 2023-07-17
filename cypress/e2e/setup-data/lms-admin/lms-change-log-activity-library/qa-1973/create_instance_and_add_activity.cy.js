import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj, activity

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-change-log/log-activity-library',
      'courseFuncActivityFromLibrary'
    ).then((course) => {
      courseObj = course
      instanceObj = courseObj.instanceUnarchiveFileLog
      activity = instanceObj.activities.sOActivityFileUnarchiveLog
    })
  })

  context(Story.lmsChangeLogActivityLibrary, () => {
    it('Setup instance "Instance unarchive file activity then check log"', () => {
      SignInAs.learningAdminEmery()
      new SetUpCourseInstance().createNewInstanceFromManageCourse(courseObj, instanceObj)
      new SetUpCourseActivity().addActivityFromLibraryByStandingOnInstance(activity)
    })
  })
})
