import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const setupInstance = new SetUpCourseInstance()
  const setupActivity = new SetUpCourseActivity()
  let courseObj

  before(() => {
    cy.stubCourse(
      'lms-training-cop/tcop-activity-library/tcop-activity-library',
      'copCourseFuncActivityLibrary'
    ).then((course) => {
      courseObj = course
    })
  })

  context(Story.tCopActivityLibrary, () => {
    it('Setup instance in "Instance Func Edit Moodle Assignment"', () => {
      SignInAs.copOwner_Kristy()
      describe('Create instance', () => {
        setupInstance.setCourseObj(courseObj)
        setupInstance.setInstanceBaseYaml('instanceFuncEditMoodleAssignment')

        setupInstance.createNewInstanceFromManageCourse()
      })
      describe('Create instance', () => {
        setupActivity.setCourseObj(courseObj)
        setupActivity.setInstanceBaseYaml('instanceFuncEditMoodleAssignment')
        setupInstance.courseList.setCourse(courseObj)

        setupInstance.courseList.visit(true)
        setupActivity.addActivityFromLibrary('tCActivityAssignmentEditPrevious')
      })
    })
  })
})
