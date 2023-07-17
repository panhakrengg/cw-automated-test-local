import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setOrgActivityLibraryYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup instance "funcSOActivityElearningEdit"', () => {
      setupInstance.setCourseBaseYaml('courseFuncActivityFromLibrary')
      setupInstance.setInstanceBaseYaml('funcSOActivityElearningEdit')

      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
