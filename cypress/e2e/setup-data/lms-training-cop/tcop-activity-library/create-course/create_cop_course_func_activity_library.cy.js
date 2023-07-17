import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    cy.stubCourse(
      'lms-training-cop/tcop-activity-library/tcop-activity-library',
      'copCourseFuncActivityLibrary'
    ).then((course) => {
      courseObj = course
    })
  })

  context(Story.tCopActivityLibrary, () => {
    it('Setup course "CoP Course Func Activity Library"', () => {
      setupCourse.setCourseObj(courseObj)

      SignInAs.copOwner_Kristy()
      setupCourse.createNewCourse()
    })
  })
})
