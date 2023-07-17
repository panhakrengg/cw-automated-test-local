import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setOrgInstanceActivityYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup instance "funcTOActivityHyperlinkInstanceEdit"', () => {
      setupInstance.setCourseBaseYaml('courseFuncActivityFromLibrary')
      setupInstance.setInstanceBaseYaml('funcTOActivityHyperlinkInstanceEdit')
      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
